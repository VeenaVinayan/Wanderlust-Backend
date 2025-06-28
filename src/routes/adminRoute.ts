import express, { Router } from 'express';
import protect from '../middlewares/protected';
import { RoleAuth } from '../middlewares/roleAuth';
import { AdminController } from '../controllers/Admin/adminController';
import { PackageController } from '../controllers/Package/packageController';
import { container } from '../config/container';
import { BookingController } from '../controllers/Booking/bookingController';

const router : Router = express.Router();

const roleAuth = new RoleAuth();

const adminController = container.get<AdminController>('AdminController');
const packageController = container.get<PackageController>('PackageController');
const bookingController = container.get<BookingController>('BookingController');

router.get('/getData/:user/:perPage/:page',protect,roleAuth.checkRole(['Admin']),adminController.getAllData);
router.patch('/blockOrUnblock',protect,roleAuth.checkRole(['Admin']),adminController.blockOrUnblock);
router.post("/getPresignedUrl",protect,roleAuth.checkRole(['Admin']),adminController.getPresignedUrl);
router.post('/addCategory',protect,roleAuth.checkRole(['Admin']),adminController.addCategory);
router.get('/categories/:perPage/:page',protect,roleAuth.checkRole(['Admin']),adminController.getCategories);
router.patch('/category-delete/:categoryId',protect,roleAuth.checkRole(['Admin']),adminController.deleteCategory);
router.get('/category-check/:categoryName',protect,roleAuth.checkRole(['Admin']),adminController.isCategoryExist);
router.patch('/category-edit/:categoryId',protect,roleAuth.checkRole(['Admin']),adminController.editCategory);
router.get('/agent-pending/:perPage/:page',protect,roleAuth.checkRole(['Admin']),adminController.pendingAgentData);
router.patch('/approveAgent/:agentId',protect,roleAuth.checkRole(['Admin']),adminController.agentApproval);
router.patch('/rejectAgentRequest/:agentId',protect,roleAuth.checkRole(['Admin']),adminController.rejectAgentRequest);
router.patch('/block-package/:packageId',protect,roleAuth.checkRole(['Admin']),adminController.blockPackage);
router.get('/packages',protect,roleAuth.checkRole(['Admin']),packageController.getPackages);
router.get('/booking',protect,roleAuth.checkRole(['Admin']),bookingController.getBookingDataToAdmin);
router.get('/dashboard',protect,roleAuth.checkRole(['Admin']),bookingController.getDashboard);
router.patch('/packages/verify/:packageId',protect,roleAuth.checkRole(['Admin']),packageController.verifyPackage);

export default router;
