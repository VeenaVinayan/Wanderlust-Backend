"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class OtpHelper {
    static generateOtp(length = 6) {
        const otp = crypto_1.default.randomInt(10 ** 5, 10 ** 6).toString();
        return otp;
    }
    static generateEmailBody(otp) {
        const body = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Wanderlust</h2>
        <p> Hi,</p>
        <p>We received a request to authenticate your account. Use the following OTP to complete the process:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">${otp}</div>
        <p>This OTP is valid for <strong>1 minute</strong>.</p>
        <p>If you didn’t request this, please ignore this email or contact our support team at support@example.com.</p>
        <p>Thanks,<br>The Wanderlust Team</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply directly to this message.</p>
      </div>`;
        return body;
    }
}
exports.default = OtpHelper;
