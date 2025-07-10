import { IBaseRepository } from '../../Interfaces/Base/IBaseRepository';
import { INotification } from '../../models/Notification';
export interface INotificationRepository extends IBaseRepository<INotification>{
    findAllNotification(userId: string): Promise<INotification[]>
}
