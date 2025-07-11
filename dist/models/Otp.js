"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OtpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
    },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 1,
    }
});
const Otp = mongoose_1.default.model('Otp', OtpSchema);
exports.default = Otp;
