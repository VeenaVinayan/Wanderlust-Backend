import { Types } from "mongoose";
import { IAgentResponse} from '../interface/Agent';

export interface UserOtp{
    email : string;
    otp:string;
    createdAt?: Date;
}

export interface UserData {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    otp?: string;
    data?: UserData;
}
  
export interface OtpData {
    email:string;
    otp: string;
}

export interface UserLogin {
   email:string;
   password:string;
}  
export interface LoginResult{
   id:Types.ObjectId;
   name:string;
   email:string;
   password:string;
   phone:string,
   role:string,
   status:boolean;
}

export interface LoginResponse{
    accessToken?:string,
    refreshToken?:string;
    user :{
        id:Types.ObjectId;
        name:string;
        email:string;
        phone:string,
        role:string,
        status:boolean;
    }
    agent?:IAgentResponse;
}
export interface TokenPayload{
  id : string;
  role:string;
}

export interface ICategory{
     name:string;
     description:string;
     fileKey:string;
}
