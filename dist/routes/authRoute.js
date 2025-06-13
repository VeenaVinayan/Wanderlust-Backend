"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
router.post('/register', authController_1.default.register);
router.post('/otp', authController_1.default.otpSubmit);
router.post('/resendOtp', authController_1.default.resendOtp);
router.post('/login', authController_1.default.login);
router.post('/refresh', authController_1.default.getAccessToken);
router.post('/forgotPassword', authController_1.default.forgotPassword);
router.post('/resetPassword', authController_1.default.resetPassword);
router.post('/logout', authController_1.default.logout);
router.get('/google', authController_1.default.googleAuth);
exports.default = router;
