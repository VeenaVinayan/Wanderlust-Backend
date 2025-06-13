import mongoose, { Schema , Document } from 'mongoose';
import User from './User';

export interface INotification extends Document{
     userId: mongoose.Schema.Types.ObjectId;
     type : string;
     message : string;
     isRead:boolean;
     createdAt: Date;
}

const NotificationSchema : Schema <INotification> = new mongoose.Schema({
     userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref:User,
         required: true,
     },
     type:{
         type:String,
         required:true,
     },
     message:{
        type:String,
        required:true,
     },
     isRead:{
         type:Boolean,
         default:false,
     }
},{timestamps:true});

const Notification = mongoose.model<INotification>('Notification',NotificationSchema);
export default Notification;