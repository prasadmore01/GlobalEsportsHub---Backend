import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { ValidationException } from "../../exceptions/CustomExceptions";

export function validationMiddleware<T extends object>(
    dtoClass: new () => T,
    skipMissingProperties = false
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dtoInstance = plainToClass(dtoClass, req.body);

            const errors: ValidationError[] = await validate(dtoInstance, {
                skipMissingProperties,
                whitelist: true,
                forbidNonWhitelisted: false
            });

            if (errors.length > 0) {
                const formattedErrors = errors.map(error => {
                    const constraints = error.constraints;
                    return constraints ? Object.values(constraints)[0] : "Validation failed";
                });

                // Throw error in your existing format
                throw new ValidationException(formattedErrors.join(", "));
            }

            // Attach validated DTO to request
            req.body = dtoInstance;
            next();
        } catch (error) {
            next(error);
        }
    };
}