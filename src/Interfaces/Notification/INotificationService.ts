import { TNotification } from '../../Types/notification';
import { INotification } from '../../models/Notification';

export interface INotificationService {
    //createNotification(payload: TNotification):Promise<void>;
    getAllNotifications(userId: string): Promise<INotification []>
    changeNotificationStatus(notificationId: string): Promise<boolean>
    createNewNotification(notification : TNotification):Promise<boolean>
}
