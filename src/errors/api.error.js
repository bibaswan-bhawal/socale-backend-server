import httpStatus from 'http-status';

class APIError extends Error {
    constructor(message, status, isPublic) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor.name);
    }

    static unauthorized(message) {
        return new APIError(message, httpStatus.UNAUTHORIZED, true);
    }

    static forbidden(message) {
        return new APIError(message, httpStatus.FORBIDDEN, true);
    }

    static notFound(message) {
        console.log(message);
        return new APIError(message, httpStatus.NOT_FOUND, true);
    }

    static badRequest(message) {
        return new APIError(message, httpStatus.BAD_REQUEST, true);
    }
}

export default APIError;