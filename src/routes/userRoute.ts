import express, { Router } from 'express';
import auth from '../middlewares/protected';
import { RoleAuth } from '../middlewares/roleAuth';
import { UserController } from '../controllers/User/userController';
import { container } from '../config/container';
import { PackageController } from '../controllers/Package/packageController';
import { isBlocked } from '../middlewares/isBlocked';
import { BookingController } from '../controllers/Booking/bookingController';
import { WishlistController } from '../controllers/Wishlist/wishlistController';
import { validation } from '../middlewares/validation';
import { ChatController } from '../controllers/Chat/chatController';
import { AgentController } from '../controllers/Agent/agentController';

const router: Router = express.Router();
const roleAuth = new RoleAuth();

const userController = container.get<UserController>('UserController');
const packageController = container.get<PackageController>('PackageController');
const bookingController = container.get<BookingController>('BookingController');
const wishlistController = container.get<WishlistController>('WishlistController');
const chatController = container.get<ChatController>('ChatController');
const agentController = container.get<AgentController>('AgentController');

router.patch('/user/update/:id',auth,roleAuth.checkRole(['User']),isBlocked,userController.updateProfile);
router.patch('/user/update-password/:id',auth,roleAuth.checkRole(['User']),isBlocked,userController.resetPassword);
router.get('/category',userController.getCategories);
router.get('/packages',userController.getPackages);
router.get('/packages-category',packageController.getCategoryPackages);
router.get('/advance-search',packageController.advanceSearch);
router.post('/stripe-payment',auth,roleAuth.checkRole(['User']),isBlocked,userController.stripePayment);
router.route('/booking')
      .post(auth,roleAuth.checkRole(['User']),isBlocked,validation,bookingController.bookPackage);
router.get('/booking/:id',auth,roleAuth.checkRole(['User']),isBlocked,bookingController.getBookingData);
router.route('/wishlist')
      .post(auth,roleAuth.checkRole(['User']),isBlocked,wishlistController.addToWishlist)
      .get(auth,roleAuth.checkRole(['User']),isBlocked,wishlistController.getWishlist)
      .delete(auth,roleAuth.checkRole(['User']),isBlocked,wishlistController.deleteWishlist);
router.route('/review')
      .post(auth,roleAuth.checkRole(['User']),isBlocked,userController.addReview)
      .get(auth,roleAuth.checkRole(['User']),isBlocked,userController.getReview)   
      .delete(auth,roleAuth.checkRole(['User']),isBlocked,userController.deleteReview);
router.patch('/reviews/:reviewId',auth,roleAuth.checkRole(['User']),isBlocked,userController.editReview);
router.get('/reviews/:packageId',userController.getReviews);    
router.post('/booking/cancel',auth,roleAuth.checkRole(['User']),isBlocked,bookingController.cancelBooking);
router.get('/wallets/:userId',auth,roleAuth.checkRole(['User']),isBlocked,userController.getWallet);
//router.get('/bookings/validate',auth,roleAuth.checkRole(['User']),isBlocked,bookingController.validateBooking);
router.get('/chats/users/:userId',auth,roleAuth.checkRole(['User']),isBlocked,chatController.getAllUsers);
router.get('/chats/messages',auth,roleAuth.checkRole(['User']),isBlocked,chatController.getMessages);
router.get('/users/details/:userId',auth,roleAuth.checkRole(['User']),userController.getUserDetails);     

export default router;