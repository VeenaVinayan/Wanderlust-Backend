import express, { Router } from 'express';
import { AuthController } from '../controllers/Auth/authController';
import { container } from '../config/container';

const router : Router = express.Router();

const authController = container.get<AuthController>('AuthController');

router.post('/register', authController.register);
router.post('/otp', authController.otpSubmit);
router.post('/resendOtp',authController.resendOtp);
router.post('/login',authController.login);
router.post('/refresh',authController.getAccessToken);
router.post('/forgotPassword',authController.forgotPassword);
router.post('/resetPassword',authController.resetPassword);
router.post('/logout',authController.logout);
router.get('/google',authController.googleAuth);

export default router;