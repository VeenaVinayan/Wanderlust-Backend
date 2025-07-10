import { inject, injectable } from 'inversify';
import { INotificationRepository } from '../../Interfaces/Notification/INotificationRepository';
import { INotification } from '../../models/Notification';
import { INotificationService } from '../../Interfaces/Notification/INotificationService';
import { TNotification } from '../../Types/notification';
import { sendNotification } from '../../socket/notificationSocket';

@injectable()
export class NotificationService implements INotificationService{
    constructor(
        @inject('INotificationRepository') private readonly _notificationRepository : INotificationRepository,
    ){}
    
    async getAllNotifications(userId : string) : Promise<INotification[]> {
        try{
            const data : INotification []= await this._notificationRepository.findAllNotification(userId);
            return data;
        }catch(err){
            throw err;
        }
    }

    async changeNotificationStatus(notificationId : string) : Promise<boolean> {
            try{
                 const res = await this._notificationRepository.updateOneById(notificationId,{isRead:true});
                 if(res) return true;
                 else return false;
            }catch(err){
                throw err;
            }
    }
    async createNewNotification(notification : TNotification):Promise<boolean>{
            try{
                    const result = await this._notificationRepository.createNewData(notification);
                    if(result){
                       const res = await sendNotification(notification);
                       if(res) return true;  
                       else return false;
                    }else return false;
            }catch(err){
                throw err;
            }
    }
}