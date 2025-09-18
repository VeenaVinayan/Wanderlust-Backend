"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const BookingValidations_1 = require("../validators/BookingValidations");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const StatusMessage_1 = require("../enums/StatusMessage");
const validation = (req, res, next) => {
    const errors = (0, BookingValidations_1.bookingValidation)(req.body);
    if (errors.length > 0) {
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ error: true, message: StatusMessage_1.StatusMessage.BAD_REQUEST });
        return;
    }
    req.body = (0, BookingValidations_1.sanitizeBooking)(req.body);
    next();
};
exports.validation = validation;
