"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const AdminRepository_1 = require("../repositories/Admin/AdminRepository");
const adminService_1 = require("../services/Admin/adminService");
const adminController_1 = require("../controllers/Admin/adminController");
const CategoryRepository_1 = require("../repositories/Admin/CategoryRepository");
const userRepository_1 = require("../repositories/User/userRepository");
const userService_1 = require("../services/User/userService");
const userController_1 = require("../controllers/User/userController");
//Agent
const AgentRepository_1 = require("../repositories/Agent/AgentRepository");
const agentService_1 = require("../services/Agent/agentService");
const agentController_1 = require("../controllers/Agent/agentController");
//Package
const PackageRepository_1 = require("../repositories/Package/PackageRepository");
const PackageService_1 = require("../services/Package/PackageService");
const packageController_1 = require("../controllers/Package/packageController");
const AdminPackageRepository_1 = require("../repositories/Package/AdminPackageRepository");
const bookingRepository_1 = require("../repositories/Booking/bookingRepository");
const bookingService_1 = require("../services/Booking/bookingService");
const bookingController_1 = require("../controllers/Booking/bookingController");
//Notification
const notificationRepository_1 = require("../repositories/Notification/notificationRepository");
const wishlistRepository_1 = require("../repositories/Wishlist/wishlistRepository");
const wishlistService_1 = require("../services/Wishlist/wishlistService");
const wishlistController_1 = require("../controllers/Wishlist/wishlistController");
const chatRepository_1 = require("../repositories/Chat/chatRepository");
const chatService_1 = require("../services/Chat/chatService");
const chatController_1 = require("../controllers/Chat/chatController");
const container = new inversify_1.Container();
exports.container = container;
//admin
container.bind('IAdminRepository').toDynamicValue(() => {
    return new AdminRepository_1.AdminRepository();
}).inRequestScope();
container.bind('IAdminService').to(adminService_1.AdminService).inSingletonScope();
container.bind('AdminController').to(adminController_1.AdminController).inSingletonScope();
container.bind('ICategoryRepository').toDynamicValue(() => {
    return new CategoryRepository_1.CategoryRepository();
});
container.bind('IAdminPackageRepository').toDynamicValue(() => {
    return new AdminPackageRepository_1.AdminPackageRepository();
});
//user
container.bind('IUserRepository').toDynamicValue(() => {
    return new userRepository_1.UserRepository();
}).inSingletonScope();
container.bind('IUserService').to(userService_1.UserService).inSingletonScope();
container.bind('UserController').to(userController_1.UserController).inSingletonScope();
//Agent
container.bind('IAgentRepository').toDynamicValue(() => {
    return new AgentRepository_1.AgentRepository();
});
container.bind('IAgentService').to(agentService_1.AgentService).inSingletonScope();
container.bind('AgentController').to(agentController_1.AgentController).inSingletonScope();
//Package
container.bind('IPackageRepository').toDynamicValue(() => {
    return new PackageRepository_1.PackageRepository();
}).inSingletonScope();
container.bind('IPackageService').to(PackageService_1.PackageService).inSingletonScope();
container.bind('PackageController').to(packageController_1.PackageController).inSingletonScope();
// Booking 
container.bind('IBookingRepository').toDynamicValue(() => {
    return new bookingRepository_1.BookingRepository();
}).inSingletonScope();
container.bind('INotificationRepository').toDynamicValue(() => {
    return new notificationRepository_1.NotificationRepository();
});
container.bind('IBookingService').to(bookingService_1.BookingService).inSingletonScope();
container.bind('BookingController').to(bookingController_1.BookingController).inSingletonScope();
// Wishlist 
container.bind('IWishlistRepository').toDynamicValue(() => {
    return new wishlistRepository_1.WishlistRepository();
}).inSingletonScope();
container.bind('IWishlistService').to(wishlistService_1.WishlistService).inSingletonScope();
container.bind('WishlistController').to(wishlistController_1.WishlistController).inSingletonScope();
//Chat
container.bind('IChatRepository').toDynamicValue(() => {
    return new chatRepository_1.ChatRepository();
}).inSingletonScope();
container.bind('IChatService').to(chatService_1.ChatService).inSingletonScope();
container.bind('ChatController').to(chatController_1.ChatController).inSingletonScope();
