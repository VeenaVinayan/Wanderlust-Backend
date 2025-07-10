import mongoose, { Schema , Document } from 'mongoose';

export interface INotification extends Document{
     userId: string;
     title : string;
     message : string;
     isRead:boolean;
     createdAt?:Date;
     updatedAt?:Date;

}

const NotificationSchema : Schema = new mongoose.Schema({
     userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'User',
         required: true,
     },
     title:{
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