"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protected_1 = __importDefault(require("../middlewares/protected"));
const roleAuth_1 = require("../middlewares/roleAuth");
const container_1 = require("../config/container");
const isBlocked_1 = require("../middlewares/isBlocked");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
const roleAuth = new roleAuth_1.RoleAuth();
const userController = container_1.container.get('UserController');
const packageController = container_1.container.get('PackageController');
const bookingController = container_1.container.get('BookingController');
const wishlistController = container_1.container.get('WishlistController');
const chatController = container_1.container.get('ChatController');
const notificationController = container_1.container.get('NotificationController');
router.patch('/users/update/:userId', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.updateProfile);
router.patch('/users/update-password/:userId', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.resetPassword);
router.get('/category', userController.getCategories);
router.get('/packages', userController.getPackages);
router.get('/packages-category', packageController.getCategoryPackages);
router.get('/advance-search', packageController.advanceSearch);
router.post('/stripe-payment', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.stripePayment);
router.route('/booking')
    .post(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, validation_1.validation, bookingController.bookPackage);
router.get('/booking/:id', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, bookingController.getBookingData);
router.route('/wishlist')
    .post(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, wishlistController.addToWishlist)
    .get(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, wishlistController.getWishlist)
    .delete(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, wishlistController.deleteWishlist);
router.route('/review')
    .post(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.addReview)
    .get(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.getReview)
    .delete(protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.deleteReview);
router.patch('/reviews/:reviewId', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.editReview);
router.get('/reviews/:packageId', userController.getReviews);
router.post('/booking/cancel', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, bookingController.cancelBooking);
router.get('/wallets/:userId', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, userController.getWallet);
router.get('/bookings/validate', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, bookingController.validateBooking);
router.get('/chats/users/:userId', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, chatController.getAllUsers);
router.get('/chats/messages', protected_1.default, roleAuth.checkRole(['User']), isBlocked_1.isBlocked, chatController.getMessages);
router.get('/users/details/:userId', protected_1.default, roleAuth.checkRole(['User']), userController.getUserDetails);
router.get('/notifications/:userId', protected_1.default, roleAuth.checkRole(['User']), notificationController.getAllNotification);
router.patch('/notifications/:notificationId', protected_1.default, roleAuth.checkRole(['User']), notificationController.changeNotificationStatus);
exports.default = router;
