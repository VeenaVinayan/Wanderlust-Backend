import { injectable } from "inversify";
import Notification ,{ INotification } from '../../models/Notification';
import { BaseRepository } from '../Base/BaseRepository';
import { INotificationRepository } from "../../Interfaces/Notification/INotificationRepository";
injectable()
export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
     private readonly _notificationModel = Notification;
     constructor(){
        super(Notification);
     }
}
