
export class HttpException extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public errors?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string = "Bad Request", errors?: any) {
        super(400, message, errors);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = "Not Found") {
        super(404, message);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = "Conflict") {
        super(409, message);
    }
}

export class ValidationException extends HttpException {
    constructor(message: string = "Validation Error", errors?: any) {
        super(422, message, errors);
    }
}

export class InternalServerException extends HttpException {
    constructor(message: string = "Internal Server Error") {
        super(500, message);
    }
}

export class ServiceUnavailableException extends HttpException {
    constructor(message: string = "Service Unavailable") {
        super(503, message);
    }
}