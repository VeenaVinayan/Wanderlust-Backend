"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const router = express_1.default.Router();
const authController = container_1.container.get('AuthController');
router.post('/register', authController.register);
router.post('/otp', authController.otpSubmit);
router.post('/resendOtp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/refresh', authController.getAccessToken);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/google', authController.googleAuth);
exports.default = router;
