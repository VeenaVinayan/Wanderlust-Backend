import express, {Request, Response, Router} from 'express';
import authController from '../controllers/authController';

const router: Router = express.Router();

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