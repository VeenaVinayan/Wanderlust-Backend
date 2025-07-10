import 'reflect-metadata';
import { Container } from 'inversify';
// Admin
import { IAdminRepository } from '../Interfaces/Admin/IAdminRepository';
import { IAdminService } from '../Interfaces/Admin/IAdminService';
import { AdminRepository } from '../repositories/Admin/AdminRepository';
import { AdminService } from '../services/Admin/adminService';
import { AdminController } from '../controllers/Admin/adminController';
import { CategoryRepository } from '../repositories/Admin/CategoryRepository';
import { Iuser } from '../Types/user.types';
//User
import { IUserRepository } from '../Interfaces/User/IUserRepository';
import { UserRepository } from  '../repositories/User/userRepository';
import { UserService } from '../services/User/userService';
import { IUserService } from '../Interfaces/User/IUserService';
import { UserController } from '../controllers/User/userController';
import Agent from '../models/Agent';
//Agent
import { AgentRepository } from '../repositories/Agent/AgentRepository';
import { AgentService } from '../services/Agent/agentService';
import { IAgentRepository } from '../Interfaces/Agent/IAgentRepository';
import { IAgentService } from '../Interfaces/Agent/IAgentService';
import { AgentController } from '../controllers/Agent/agentController';
import { ICategoryRepository } from '../Interfaces/Admin/ICategoryRepository';
//Package
import { PackageRepository } from '../repositories/Package/PackageRepository';
import { PackageService} from '../services/Package/PackageService';
import { PackageController } from '../controllers/Package/packageController';
import {IPackageRepository }  from '../Interfaces/Package/IPackageRepository';
import { IPackageService } from '../Interfaces/Package/IPackageService';
import { AdminPackageRepository } from '../repositories/Package/AdminPackageRepository';
import { IAdminPackageRepository } from '../Interfaces/Package/IAdminPackageRepository';
//Booking
import { IBookingRepository } from '../Interfaces/Booking/IBookingRepository';
import { BookingRepository } from '../repositories/Booking/bookingRepository';
import { IBookingService } from '../Interfaces/Booking/IBookingService';
import { BookingService } from '../services/Booking/bookingService';
import { BookingController } from '../controllers/Booking/bookingController';

// Wishlist
import { IWishlistRepository } from '../Interfaces/Wishlist/IWishlistReposiory';
import { IWishlistService } from '../Interfaces/Wishlist/IWishlistService';
import { WishlistRepository } from '../repositories/Wishlist/wishlistRepository';
import { WishlistService } from '../services/Wishlist/wishlistService';
import { WishlistController } from '../controllers/Wishlist/wishlistController';
// chat
import { IChatRepository } from '../Interfaces/Chat/IChatRepository';
import { IChatService } from '../Interfaces/Chat/IChatService';
import { ChatRepository } from '../repositories/Chat/chatRepository';
import { ChatService } from '../services/Chat/chatService';
import { ChatController } from '../controllers/Chat/chatController';
//Notification
import { INotificationRepository } from '../Interfaces/Notification/INotificationRepository';
import { INotificationService } from '../Interfaces/Notification/INotificationService';
import { NotificationRepository } from '../repositories/Notification/notificationRepository';
import { NotificationService } from '../services/Notification/notificationService' ;
import { NotificationController } from '../controllers/Notification/notificationController';

const container = new Container();
//admin
container.bind<IAdminRepository>('IAdminRepository').toDynamicValue(()=>{
   return new AdminRepository();
}).inRequestScope();
container.bind<IAdminService>('IAdminService').to(AdminService).inSingletonScope();
container.bind<AdminController>('AdminController').to(AdminController).inSingletonScope();

container.bind<ICategoryRepository>('ICategoryRepository').toDynamicValue( () =>{
     return new CategoryRepository();
})
container.bind<IAdminPackageRepository>('IAdminPackageRepository').toDynamicValue(() =>{
      return new AdminPackageRepository();
})
//user
container.bind<IUserRepository>('IUserRepository').toDynamicValue(()=> {
     return new UserRepository();
}).inSingletonScope();
container.bind<IUserService>('IUserService').to(UserService).inSingletonScope();
container.bind<UserController>('UserController').to(UserController).inSingletonScope();
//Agent
container.bind<IAgentRepository>('IAgentRepository').toDynamicValue( () => {
     return new AgentRepository();
});
container.bind<IAgentService>('IAgentService').to(AgentService).inSingletonScope();
container.bind<AgentController>('AgentController').to(AgentController).inSingletonScope();

//Package
container.bind<IPackageRepository>('IPackageRepository').toDynamicValue(() => {
      return new PackageRepository();
}).inSingletonScope();
container.bind<IPackageService>('IPackageService').to(PackageService).inSingletonScope();
container.bind<PackageController>('PackageController').to(PackageController).inSingletonScope();

// Booking 
container.bind<IBookingRepository>('IBookingRepository').toDynamicValue(() => {
     return new BookingRepository();
}).inSingletonScope();
container.bind<IBookingService>('IBookingService').to(BookingService).inSingletonScope();
container.bind<BookingController>('BookingController').to(BookingController).inSingletonScope();

// Wishlist 
container.bind<IWishlistRepository>('IWishlistRepository').toDynamicValue(() =>{
      return new WishlistRepository();
}).inSingletonScope();
container.bind<IWishlistService>('IWishlistService').to(WishlistService).inSingletonScope();
container.bind<WishlistController>('WishlistController').to(WishlistController).inSingletonScope();

//Chat
container.bind<IChatRepository>('IChatRepository').toDynamicValue(() =>{
       return new ChatRepository();
}).inSingletonScope();
container.bind<IChatService>('IChatService').to(ChatService).inSingletonScope();
container.bind<ChatController>('ChatController').to(ChatController).inSingletonScope();

//Notification
container.bind<INotificationRepository>('INotificationRepository').toDynamicValue(() =>{
       return new NotificationRepository();
}).inSingletonScope();
container.bind<INotificationService>('INotificationService').to(NotificationService).inSingletonScope();
container.bind<NotificationController>('NotificationController').to(NotificationController).inSingletonScope();

export { container };