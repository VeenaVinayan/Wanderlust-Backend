import express, { Router } from 'express';
import protect from '../middlewares/protected';
import { RoleAuth } from '../middlewares/roleAuth';
import { AgentController } from '../controllers/Agent/agentController';
import { container } from '../config/container';
import { PackageController } from '../controllers/Package/packageController';
import { BookingController } from '../controllers/Booking/bookingController';
import { ChatController } from '../controllers/Chat/chatController';
import { NotificationController } from '../controllers/Notification/notificationController';

const router : Router = express.Router();
const roleAuth = new RoleAuth();

const agentController = container.get<AgentController>('AgentController');
const packageController = container.get<PackageController>('PackageController');
const bookingController = container.get<BookingController>('BookingController');
const chatController = container.get<ChatController>('ChatController');
const notificationController = container.get<NotificationController>('NotificationController');

router.post("/getPresignedUrl",protect,roleAuth.checkRole(['Agent']),agentController.getPresignedUrl);
router.patch('/upload-certificate/:id',protect,roleAuth.checkRole(['Agent']),agentController.uploadCertificate);
router.post('/packages',protect,roleAuth.checkRole(['Agent']),packageController.addPackage);
router.get('/categories',protect,roleAuth.checkRole(['Agent']),agentController.getCategories);
router.post('/getPresignedUrls',protect,roleAuth.checkRole(['Agent']),agentController.getSignedUrls)
router.patch('/edit-package/:packageId',protect,roleAuth.checkRole(['Agent']),packageController.editPackage);
router.patch('/delete-image',protect,roleAuth.checkRole(['Agent']),agentController.deleteImages);
router.patch('/delete-package/:packageId',protect,roleAuth.checkRole(['Agent']),packageController.deletePackage);
router.get('/packages/:id',protect,roleAuth.checkRole(['Agent']),packageController.getAgentPackages);
router.get('/booking/:id',protect,roleAuth.checkRole(['Agent']),bookingController.getAgentBookingData);
router.patch('/booking/:bookingId',protect,roleAuth.checkRole(['Agent']),bookingController.updateBookingStatusByAgent);
router.get('/bookings/package/:packageId',protect,roleAuth.checkRole(['Agent']),bookingController.getPackageBooking)
router.get('/chats/users/:userId',protect,roleAuth.checkRole(['Agent']),chatController.getAllUsers);
router.get('/chats/messages',protect,roleAuth.checkRole(['Agent']),chatController.getMessages);
router.get('/dashboard/:agentId',protect,roleAuth.checkRole(['Agent']),agentController.getDashboardData);
router.get('/notifications/:userId',protect,roleAuth.checkRole(['Agent']),notificationController.getAllNotification);
router.patch('/notifications/:notificationId',protect,roleAuth.checkRole(['Agent']),notificationController.changeNotificationStatus)
export default router;