"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
const jwt_1 = require("../../utils/jwt");
const googleService_1 = require("../../services/googleService");
let AuthController = class AuthController {
    constructor(_authService) {
        this._authService = _authService;
        this.register = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('IN authController !!', req.body);
                const user = yield this._authService.register(req.body);
                if (user) {
                    res.status(HttpStatusCode_1.HttpStatusCode.CONFLICT).json({
                        error: true,
                        message: StatusMessage_1.StatusMessage.CONFLICT
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                        success: true,
                        message: StatusMessage_1.StatusMessage.SENT_MAIL,
                    });
                }
            }
            catch (error) {
                console.error('Error in register:', error);
                throw error;
            }
        }));
        this.otpSubmit = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Otp Submit Controller', req.body);
                const response = yield this._authService.otpSubmit(req.body);
                if (response === "success") {
                    res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({ success: true, message: StatusMessage_1.StatusMessage.CREATED });
                }
                if (response === "error") {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.INVALID_OTP });
                }
            }
            catch (err) {
                console.error('Error in otpSubmit:', err);
                throw err;
            }
        }));
        this.resendOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._authService.resendOtp(req.body.email);
                console.log(" Resend otp ::", response);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SENT_MAIL });
            }
            catch (err) {
                throw err;
            }
        }));
        this.login = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Login Controller! Values:");
                const response = yield this._authService.login(req.body);
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
                        maxAge: 10 * 24 * 60 * 60 * 1000,
                    });
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                        success: true,
                        message: StatusMessage_1.StatusMessage.LOGIN_SUCCESS,
                        data: response,
                    });
                    return;
                }
            }
            catch (err) {
                console.error("Error in login controller:", err);
                throw err;
            }
        }));
        this.getAccessToken = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Refresh Token Controller!");
                if (!req.cookies || !req.cookies.token) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.REFRESH_TOKEN_MISSING });
                    return;
                }
                const refreshToken = req.cookies.token;
                console.log("Refresh Token:", refreshToken);
                const accessToken = yield this._authService.getAccessToken(refreshToken);
                if (accessToken) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, accessToken });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ error: true, message: StatusMessage_1.StatusMessage.REFRESH_TOKEN_EXPIRY });
                }
            }
            catch (error) {
                console.error("Error in refresh token controller:", error);
                throw error;
            }
        }));
        this.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Logout countroller !');
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ success: true, message: StatusMessage_1.StatusMessage.LOGOUT_SUCCESS });
        }));
        this.forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD });
                return;
            }
            console.log('Forgot Password controller : Email !', email);
            const response = yield this._authService.forgotPassword(email);
            if (response) {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SENT_MAIL });
            }
            else {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.INVALID_CREDENTIALS });
            }
        }));
        this.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(" Reset password Controller !", req.body);
            const { password, token } = req.body;
            const response = yield this._authService.resetPassword(token, password);
            if (response) {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            else {
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage_1.StatusMessage.TOKEN_EXPIRED });
            }
        }));
        this.googleAuth = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.query;
                const googleService = new googleService_1.GoogleService();
                if (!code) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                        message: StatusMessage_1.StatusMessage.FORBIDDEN
                    });
                }
                const payload = yield googleService.googleAuth(String(code));
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
                    maxAge: 30 * 24 * 60 * 60 * 1000,
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
        }));
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAuthService')),
    __metadata("design:paramtypes", [Object])
], AuthController);
