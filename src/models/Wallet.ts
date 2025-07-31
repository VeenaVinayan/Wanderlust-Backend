import mongoose, { Document, Types ,Schema } from 'mongoose';

export interface IWallet extends Document{
    userId: Types.ObjectId;
    amount:number;
    transaction:{
          transactionData : Date;
          amount:number;
          description:string;
          bookingId:string;
    }[]
}
const WalletSchema : Schema<IWallet> = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    amount:{
        type:Number,
        required: true,
        default:0,
    },
    transaction:[{
         transactionDate: {
            type: Date,
            default:Date.now()
         },
         amount:{
             type:Number,
             required:true,
         },
         description:{
             type:String,
             required:true,
         },
         bookingId:{
             type:String,
             required:true,
         }         
    }]
},{timestamps: true}  
);
    
const Wallet = mongoose.model<IWallet>('Wallet',WalletSchema);
export default Wallet;