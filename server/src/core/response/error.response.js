'use strict';

const { ReasonPhrases, StatusCodes } = require("../../untils/httpStatus");

class CustomError extends Error {
    constructor({message, status}) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends CustomError {
    constructor(message = ReasonPhrases.BAD_REQUEST) {
        super({message, status: StatusCodes.BAD_REQUEST});
    }
}

class ForbiddenError extends CustomError {
    constructor(message = ReasonPhrases.FORBIDDEN) {
        super({message, status: StatusCodes.FORBIDDEN});
    }
}

class ConflictError extends CustomError {
    constructor(message = ReasonPhrases.CONFLICT) {
        super({message, status: StatusCodes.CONFLICT});
    }
}

class InternalError extends CustomError {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR) {
        super({message, status: StatusCodes.INTERNAL_SERVER_ERROR});
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    ForbiddenError,
    ConflictError,
    InternalError
}