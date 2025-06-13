"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const error = new Error(`Not Found -${req.originalUrl}`);
    res.status(404);
    next(error);
};
const ErrorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    if (err.name === "CastError" && err.kind === 'ObjectId') {
        statusCode = 404;
        message = "Resource Not Found";
    }
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};
exports.default = ErrorHandler;
