import Notification ,{ INotification } from '../../models/Notification';
import { BaseRepository } from '../Base/BaseRepository';
import { INotificationRepository } from "../../Interfaces/Notification/INotificationRepository";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
     private readonly _notificationModel = Notification;
     constructor(){
        super(Notification);
     }

     async findAllNotification(userId : string):Promise<INotification[]>{
        try{
            const data : INotification[] = await this._notificationModel.find({userId})
                                                                        .sort({createdAt:-1})
                                                                        .limit(10);   
            console.log("Data value =",data);
            return data;
         }catch(err){
            throw err;
         }
     }
}
