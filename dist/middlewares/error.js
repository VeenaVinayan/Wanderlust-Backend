"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const error = new Error(`Not Found -${req.originalUrl}`);
    res.status(404);
    next(error);
};
function isCastError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        'kind' in error &&
        error.name === 'CastError' &&
        error.kind === 'ObjectId');
}
const ErrorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    if (err instanceof Error) {
        let message = err.message;
        if (isCastError(err)) {
            statusCode = 404;
            message = "Resource Not Found";
        }
        res.status(statusCode).json({
            message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
};
exports.default = ErrorHandler;
