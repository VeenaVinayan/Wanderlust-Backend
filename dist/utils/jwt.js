"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw "Invalid expiry !!";
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES_IN) {
        throw "Invalid expiry !!";
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        const jwtSecret = process.env.JWT_SECRET || "travel123456";
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
            const payload = {
                id: decoded.id,
                role: decoded.role
            };
            return payload;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error("TokenExpired Error : Refresh token expired !");
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("JsonWebTokenError :Invalid Token Error !");
        }
        else {
            console.error('Error verifying refresh Token !');
        }
        return null;
    }
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is missing in environment variables.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (decoded && decoded.id && decoded.role) {
            const payload = {
                id: decoded.id,
                role: decoded.role,
            };
            const accessToken = (0, exports.generateAccessToken)(payload);
            return accessToken;
        }
        else {
            console.error("Invalid Token: Missing payload data");
            return null;
        }
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error("TokenExpiredError: Refresh token expired!", err.message);
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("JsonWebTokenError: Invalid Refresh Token!", err.message);
        }
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
