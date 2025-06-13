import mongoose, { Schema, Document } from "mongoose";

interface IOtp extends Document{
      email: string;
      otp:string;
      createdAt:Date;
}

const OtpSchema : Schema<IOtp> = new mongoose.Schema({
      email:{
         type:String,
       },
      otp:{
         type: String,
     },
      createdAt:{
         type:Date,
         default: Date.now,
         expires: 60 * 1,
      }
});

const Otp = mongoose.model<IOtp>('Otp',OtpSchema);

export default Otp;