import mongoose,{ Schema} from 'mongoose';

export interface IMessage extends Document{
    _id: string;
    sender:string;
    receiver:string;
    content:string;
    status:string;
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
        status:{
             type:String,
             enum: ['sent','delivered','read'],
             default:'sent',
        }    
},{timestamps:true});

const Message = mongoose.model<IMessage>('Message',MessageSchema);
export default Message;

