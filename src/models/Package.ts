import mongoose, { Schema ,Types, Document} from 'mongoose';

export interface IPackage extends Document {
     _id:string;
     name:string;
     description:string;
     images:string[];
     agent:Types.ObjectId;
     category: Types.ObjectId;
     status:boolean;
     day:number;
     night:number;
     price:number;
     isBlocked:boolean;
     totalCapacity:number;
     discount:number;
     itinerary:{
         day:number;
         description:string;
         activities:string;
         meals:string[];
         stay:string;
         transfer:string;
    }[],
    isVerified: string;
}

const PackageSchema : Schema = new mongoose.Schema({
    name:{
         type: String,
         unique:true,
         required:true,
     },
     description:{
        type:String,
        required:true,
     },
     agent:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
     },
     category:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'Category',
         required:true,
     },
     images:[{
          type:String,
          required: true,
     }],
     status:{
         type:Boolean,
         default:true,
     },
     day:{
        type:Number,
        required:true,
     },
     night:{
        type:Number,
        required:true,
     },
     price:{
         type:Number,
         required:true,
     },
     isBlocked:{
        type:Boolean,
        default:false,
     },
     totalCapacity:{
         type:Number,
         required:true,
     },
     discount:{
        type:Number,
        default:0,
     },
     itinerary:[{
         day:{
             type: Number,
             required:true,
         },
         description:{
             type:String,
             required:true,
         },
         activities:{
             type:String,
             required:true,
         },
         meals:[{
             type:String,
             required:true,
         }],
         stay:{
            type:String,
            required:true,
         },
         transfer:{
            type:String,
            required:true,
        },
     }],
     isVerified:{
             type:String,
             enum:['Eending','Approved','Rejected'],
             default:'Pending',
     },
},{timestamps:true});

const Package = mongoose.model<IPackage>('Package',PackageSchema);
export default Package;
