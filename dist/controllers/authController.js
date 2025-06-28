"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const googleService_1 = require("../services/googleService");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const StatusMessage_1 = require("../enums/StatusMessage");
const jwt_1 = require("../utils/jwt");
const authController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('IN authController !!', req.body);
            const { user, otp, time } = yield authService_1.default.register(req.body);
            if (user) {
                res.status(409).json({
                    error: true,
                    message: 'Already registered Email, Try another one!'
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    message: 'OTP successfully sent!',
                });
            }
        }
        catch (error) {
            console.error('Error in register:', error);
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
            });
        }
    }),
    otpSubmit: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Otp Submit Controller', req.body);
            const response = yield authService_1.default.otpSubmit(req.body);
            if (response === "success") {
                res.status(201).json({ success: true, data: 'Successfully registered!' });
            }
            if (response === "error") {
                res.status(400).json({ success: false, data: "Invalid OTP !" });
            }
        }
        catch (err) {
            console.error('Error in otpSubmit:', err);
            res.status(500).json({ error: true, data: 'Internal Server Error' });
        }
    }),
    agentRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Agent Register Controller ! ");
    }),
    resendOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield authService_1.default.resendOtp(req.body.email);
            console.log(" Resend otp ::", response);
            res.status(200).json({ success: true, data: "Otp sent successfully ! " });
        }
        catch (err) {
            res.status(500).json({ error: true, data: "Internal SErver Error !" });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Login Controller! Values:");
            const response = yield authService_1.default.login(req.body);
            if (typeof response === "string") {
                if (response === "User") {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ error: true, message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                else if (response === "Blocked") {
                    res.status(403).json({ error: true, message: StatusMessage_1.StatusMessage.BLOCKED });
                    return;
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: StatusMessage_1.StatusMessage.INVALID_CREDENTIALS });
                }
            }
            if (typeof response === "object") {
                res.cookie("token", response.refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 10 * 24 * 60 * 60 * 1000, // 30 days
                });
                res.status(200).json({
                    success: true,
                    message: "Successfully logged in!",
                    data: response,
                });
                return;
            }
        }
        catch (err) {
            console.error("Error in login controller:", err);
            res.status(500).json({ error: true, message: "Internal server error!" });
        }
    }),
    getAccessToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Refresh Token Controller!");
            if (!req.cookies || !req.cookies.token) {
                res.status(401).json({ message: "Refresh Token is missing!" });
                return;
            }
            const refreshToken = req.cookies.token;
            console.log("Refresh Token:", refreshToken);
            const accessToken = yield authService_1.default.getAccessToken(refreshToken);
            if (accessToken) {
                res.status(200).json({ success: true, accessToken });
            }
            else {
                res.status(401).json({ error: true, message: "Refresh Token Expired or Invalid!" });
            }
        }
        catch (error) {
            console.error("Error in refresh token controller:", error);
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Logout countroller !');
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'succesfully Logout!' });
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        console.log('Forgot Password controller : Email !', email);
        const response = yield authService_1.default.forgotPassword(email);
        if (response) {
            res.status(200).json({ success: true, message: 'Successfully eamil sent !!' });
        }
        else {
            res.status(200).json({ success: false, message: 'Invalid email !!' });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(" Reset password Controller !", req.body);
        const { password, token } = req.body;
        const response = yield authService_1.default.resetPassword(token, password);
        if (response) {
            res.status(200).json({ success: true, message: 'Successfully reset password !' });
        }
        else {
            res.status(401).json({ success: false, message: 'Error occured !' });
        }
    }),
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { code } = req.query;
            console.log('Google auth....', code);
            const googleService = new googleService_1.GoogleService();
            if (!code) {
                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    message: StatusMessage_1.StatusMessage.FORBIDDEN
                });
            }
            const payload = yield googleService.googleAuth(code);
            if (!payload) {
                res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                    message: 'INvalid Google Token'
                });
                return;
            }
            const payloadJwt = {
                id: payload.id.toString(),
                role: payload.role,
            };
            const accessToken = (0, jwt_1.generateAccessToken)(payloadJwt);
            const refreshToken = (0, jwt_1.generateRefreshToken)(payloadJwt);
            console.log("Token ::: ", accessToken, refreshToken);
            res.cookie("token", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            const user = {
                id: payload._id,
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                role: payload.role,
                status: payload.status,
            };
            console.log('User data ::', user);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                message: StatusMessage_1.StatusMessage.CREATED, data: {
                    accessToken,
                    user
                }
            });
        }
        catch (error) {
            console.error('Google Auth error :', error);
            res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR
            });
        }
    })
};
exports.default = authController;
