import mongoose,{ Schema} from 'mongoose';

export interface IMessage extends Document{
    _id: string;
    sender:string;
    receiver:string;
    content:string;
    status:string;
    isRead:boolean;
};
const MessageSchema: Schema = new mongoose.Schema({
        sender:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'User',
             required:true,
        },
        receiver: {
             type: mongoose.Schema.Types.ObjectId,
             ref:'User',
             required:true,
        },
        content:{
             type:String,
             required:true,
        },
        isRead:{
             type:Boolean,
             default:false,
        }    
},{timestamps:true});

const Message = mongoose.model<IMessage>('Message',MessageSchema,'messages');
export default Message;

