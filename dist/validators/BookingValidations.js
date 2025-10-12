"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeBooking = exports.bookingValidation = void 0;
const validator_1 = __importDefault(require("validator"));
const bookingValidation = (bookingData) => {
    var _a, _b, _c;
    const { userId, packageId, bookingDate, totalGuest, tripDate, travellers, totalAmount, email, phone } = bookingData;
    const errors = [];
    if (!tripDate || !validator_1.default.isISO8601(tripDate)) {
        errors.push("Trip Date is not a valid ISO date!");
    }
    if (!userId) {
        errors.push("User Id missing");
    }
    if (packageId) {
        errors.push("Package Id is Missing !");
    }
    if (totalGuest) {
        errors.push("Total Guesst is missing !");
    }
    if (!email || !validator_1.default.isEmail(email)) {
        errors.push("Email is not valid!");
    }
    if (!phone || !validator_1.default.isMobilePhone(phone)) {
        errors.push("Mobile phone number is not valid!");
    }
    if (totalAmount === undefined || !validator_1.default.isNumeric(totalAmount.toString())) {
        errors.push("Total amount is not valid!");
    }
    if (!bookingDate || !validator_1.default.isISO8601(bookingDate)) {
        errors.push("Booking Date Invalid!");
    }
    if (!travellers) {
        errors.push("Travellers data is missing!");
    }
    else {
        if (!validator_1.default.isInt((_a = travellers.adult) === null || _a === void 0 ? void 0 : _a.toString()) ||
            !validator_1.default.isInt((_b = travellers.children) === null || _b === void 0 ? void 0 : _b.toString()) ||
            !validator_1.default.isInt((_c = travellers.infant) === null || _c === void 0 ? void 0 : _c.toString())) {
            errors.push("Traveller counts must be valid integers!");
        }
    }
    return errors;
};
exports.bookingValidation = bookingValidation;
const sanitizeBooking = (bookingData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        userId: validator_1.default.trim(bookingData.userId),
        packageId: validator_1.default.trim(bookingData.packageId),
        totalGuest: parseInt(bookingData.bookingDate),
        email: validator_1.default.normalizeEmail(bookingData.email) || '',
        totalAmount: parseFloat(bookingData.totalAmount.toString()),
        phone: validator_1.default.trim(bookingData.phone || ''),
        tripDate: validator_1.default.toDate(((_a = bookingData.tripDate) === null || _a === void 0 ? void 0 : _a.toString()) || '') || null,
        bookingDate: validator_1.default.toDate(((_b = bookingData.bookingDate) === null || _b === void 0 ? void 0 : _b.toString()) || '') || null,
        travellers: {
            adult: parseInt(((_d = (_c = bookingData.travellers) === null || _c === void 0 ? void 0 : _c.adult) === null || _d === void 0 ? void 0 : _d.toString()) || '0'),
            children: parseInt(((_f = (_e = bookingData.travellers) === null || _e === void 0 ? void 0 : _e.children) === null || _f === void 0 ? void 0 : _f.toString()) || '0'),
            infant: parseInt(((_h = (_g = bookingData.travellers) === null || _g === void 0 ? void 0 : _g.infant) === null || _h === void 0 ? void 0 : _h.toString()) || '0'),
        }
    };
};
exports.sanitizeBooking = sanitizeBooking;
