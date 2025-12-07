// src/filters/ExceptionFilter.ts
import { Request, Response, NextFunction } from "express";
import { HttpException, InternalServerException } from "../exceptions/CustomExceptions";
import { QueryFailedError } from "typeorm";

interface ErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors?: any;
    timestamp: string;
    path: string;
    method: string;
    stack?: string;
}

export class ExceptionFilter {
    /**
     * Global error handler middleware
     */
    static handle(err: Error, req: Request, res: Response, next: NextFunction) {
        const isDevelopment = process.env.NODE_ENV === "development";

        let statusCode = 500;
        let message = "Internal Server Error";
        let errors: any = undefined;

        // Handle custom HTTP exceptions
        if (err instanceof HttpException) {
            statusCode = err.statusCode;
            message = err.message;
            errors = err.errors;
        }
        // Handle TypeORM Query Failed errors
        else if (err instanceof QueryFailedError) {
            statusCode = 400;
            message = "Database query failed";
            errors = ExceptionFilter.parseTypeORMError(err);
        }
        // Handle validation errors from express-validator or similar
        else if (err.name === "ValidationError") {
            statusCode = 422;
            message = "Validation Error";
            errors = err.message;
        }
        // Handle JWT errors
        else if (err.name === "JsonWebTokenError") {
            statusCode = 401;
            message = "Invalid token";
        }
        else if (err.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Token expired";
        }
        // Handle syntax errors (invalid JSON in request body)
        else if (err instanceof SyntaxError && "body" in err) {
            statusCode = 400;
            message = "Invalid JSON in request body";
        }
        // Handle unknown errors
        else {
            message = isDevelopment ? err.message : "Internal Server Error";
        }

        const errorResponse: ErrorResponse = {
            success: false,
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: req.url,
            method: req.method
        };

        // Add errors field if exists
        if (errors) {
            errorResponse.errors = errors;
        }

        // Add stack trace in development mode
        if (isDevelopment && err.stack) {
            errorResponse.stack = err.stack;
        }

        // Log error
        ExceptionFilter.logError(err, req, errorResponse);

        // Send response
        res.status(statusCode).json(errorResponse);
    }

    /**
     * Parse TypeORM errors to user-friendly messages
     */
    private static parseTypeORMError(err: QueryFailedError): any {
        const error: any = err;

        // PostgreSQL error codes
        if (error.code) {
            switch (error.code) {
                case "23505": // Unique constraint violation
                    return {
                        type: "UNIQUE_VIOLATION",
                        detail: error.detail || "Duplicate entry found"
                    };
                case "23503": // Foreign key violation
                    return {
                        type: "FOREIGN_KEY_VIOLATION",
                        detail: error.detail || "Referenced record not found"
                    };
                case "23502": // Not null violation
                    return {
                        type: "NOT_NULL_VIOLATION",
                        detail: error.detail || "Required field is missing"
                    };
                case "22P02": // Invalid text representation
                    return {
                        type: "INVALID_INPUT",
                        detail: "Invalid input format"
                    };
                default:
                    return {
                        type: "DATABASE_ERROR",
                        code: error.code,
                        detail: error.detail || error.message
                    };
            }
        }

        return error.message;
    }

    /**
     * Log error to console/file
     */
    private static logError(err: Error, req: Request, response: ErrorResponse) {
        const logData = {
            timestamp: response.timestamp,
            method: req.method,
            path: req.url,
            statusCode: response.statusCode,
            message: response.message,
            ip: req.ip,
            userAgent: req.get("user-agent"),
            body: req.body,
            params: req.params,
            query: req.query
        };

        // Log based on severity
        if (response.statusCode >= 500) {
            console.error("❌ ERROR:", logData);
            console.error("Stack:", err.stack);
        } else if (response.statusCode >= 400) {
            console.warn("⚠️  WARNING:", logData);
        }

        // Here you can add integration with logging services like:
        // - Winston
        // - Sentry
        // - CloudWatch
        // - Datadog
    }

    /**
     * Handle 404 Not Found
     */
    static notFoundHandler(req: Request, res: Response) {
        res.status(404).json({
            success: false,
            statusCode: 404,
            message: `Route ${req.method} ${req.url} not found`,
            timestamp: new Date().toISOString(),
            path: req.url,
            method: req.method
        });
    }

    /**
     * Async error wrapper for route handlers
     * Automatically wraps non-HttpException errors in InternalServerException
     */
    static asyncHandler(fn: Function) {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch((err: Error) => {
                // If it's already an HttpException, pass it through
                if (err instanceof HttpException) {
                    return next(err);
                }
                // Otherwise, wrap it in InternalServerException
                // Preserve original error message in development mode
                const isDevelopment = process.env.NODE_ENV === "development";
                const message = isDevelopment && err.message
                    ? `Internal Server Error: ${err.message}`
                    : "Internal Server Error";
                next(new InternalServerException(message));
            });
        };
    }
}