import { IAuthService } from '../../Interfaces/Auth/IAuthService';
import { inject, injectable } from 'inversify';
import { UserData , UserOtp, OtpData, UserLogin, LoginResult, LoginResponse, TokenPayload} from '../../interface/Interface';
import { IAuthRepository } from '../../Interfaces/Auth/IAuthRepository';
import OtpHelper from '../../helper/otpHelper';
import EmailHelper from '../../helper/emailHelper';
import bcryptjs from 'bcryptjs';
import sendMail from '../../utils/mailSender';
import { IUser } from '../../models/User';
import { IAgent } from '../../interface/Agent';
import  mongoose  from 'mongoose';
import { generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../../utils/jwt';
import { IAgentResponse } from '../../interface/Agent';
import { TUserData , TAgent} from '../../Types/user.types';

injectable()
export class AuthService implements IAuthService{
    constructor(
        @inject("IAuthRepository") private _authRepository : IAuthRepository
    ){}
    async register(userData : UserData):Promise<boolean>{
     try{     
         console.log("Service ... user Data ::", userData);
         const {  email } = userData;
         const isUserExist : LoginResult| null= await this._authRepository.isUserExist(email);
        // const res: { user: boolean ; otp?: string; time?: Date } = { user: isUserExist? true:false };
        const res = isUserExist? true : false;
         console.log("User Response :: ", res);
         if (isUserExist === null) {
            const otp:string = OtpHelper.generateOtp();
            console.log("Otp is ::", otp);
            // res.otp = otp;
            // res.time = new Date();
            const body = OtpHelper.generateEmailBody(otp);
            await sendMail(email, "OTP Verification", body);
            await this._authRepository.saveOtp(email, otp);
            console.log(res);
      }
    return res;
   }catch(err){
       throw err;
   }
  }
  async otpSubmit(userData : TUserData):Promise<string>{
      try {
       console.log("Otp submit service !!");
       const { data, user} = userData; 
       const { name, email, phone, password } = data || {name:"",email:"",phone:"",password:"",address:""};
       const otpUser :string = userData.otp || " ";
       const otpValue : UserOtp | null=  await this._authRepository.getOtp(email);  
       if(!otpValue) return "error";
       const isOtpValid = otpValue.otp === otpUser;
       let timeDiff : number = 0;
       if(otpValue?.createdAt){
          timeDiff = new Date().getTime() - new Date(otpValue?.createdAt).getTime(); 
       }
       if (isOtpValid && timeDiff < 60000) {
        if(password){
           const hashPassword = await bcryptjs.hash(password, 10);
           const User = {
              name,
              email,
              phone,
              password: hashPassword,
              role:user,
           };
          const res : IUser= await this._authRepository.createNewData(User);
          console.log("Agent Data ::",res);
          if(user === "Agent" && res._id ){
             const agentData = data as TAgent;
              const Agent :IAgent= {
                  userId: new mongoose.Types.ObjectId(res._id),
                  address:{
                       home: agentData.address.home,
                       street: agentData.address.street ?? '',
                       city: agentData.address.city,
                       state:agentData.address.state,
                       country:agentData.address.country,
                       zipcode:agentData.address.zipcode,
                  }, 
              }
              console.log(" Data agent ::",Agent);
              await this._authRepository.registerAgent(Agent); 
           }
        return "success" ;
       }else return "error" ;
      }else{
           console.log("Invalid otp !")
           return "error"
      }
    } catch (err) {
        throw err;
    }
  }
  async resendOtp(userEmail : string): Promise<string>{
    try{
        console.log("Resend OTP ");
        const otpNew = OtpHelper.generateOtp();
        const body = OtpHelper.generateEmailBody(otpNew);
        sendMail(userEmail, "OTP Verification", body);
        this._authRepository.saveOtp(userEmail, otpNew);
        const dataOtp : OtpData ={
            email:userEmail,
            otp:otpNew,
        }
        const data = this._authRepository.updateOtp(dataOtp)
        return data;
    }catch(err){
        throw err;
    }
  }
  async login(userData: UserLogin) : Promise<LoginResponse | string >{
    try{
      console.log('Auth Services !!', userData);
      let res : LoginResponse;
      let response : LoginResult | null = await this._authRepository.login(userData.email);
      if(!response) return "User";
      if(!response.status) return "Blocked"
      let isVerified  = await bcryptjs.compare(userData.password,response.password);
            if(isVerified){
              const userData : TokenPayload ={
                id: response.id.toString(),
                role:response.role,
             }
             const accessToken = generateAccessToken(userData);
             const refreshToken =generateRefreshToken(userData);

             const user  = {
                id:response.id,
                name: response.name,
                email:response.email,
                phone:response.phone,
                role:response.role,
                status:response.status
              }
             res ={
                  accessToken,
                  refreshToken,
                  user,
              }
              if(response.role === "Agent"){
                  const agent : IAgentResponse | null = await this._authRepository.getAgentData(response.id.toString());
                  console.log("Agent Data :::",agent)
                  if(agent){
                      res ={...res , ...agent};
                   }
              }
              return res;
          }else{
            console.log('Invalid credentials !!')
            return "Invalid";
          }
        }catch(err){
          console.log(err);
           throw err;
        } 
   }
   async getAccessToken(token : string) :Promise<string | null>{
        const accessToken = verifyRefreshToken(token);
        if(accessToken){
            return accessToken
        }else{
           return null;
        }
    }
   async forgotPassword(email: string) :Promise<boolean>{
      console.log('Forgot password Service !');
      const user = await this._authRepository.isUserExist(email);
      if(user){
        const userId : TokenPayload ={
           id: user.id.toString(),
           role:user.role,
       }
        const token = generateAccessToken(userId);
        const body = EmailHelper.generateEmailBody(token);
        sendMail(email,"Reset Password",body);
        return true;
      }else{
        return false;
      }
   }
   async resetPassword(token : string ,password : string) :Promise<boolean>{
      try{
          console.log('Reset password SErvice !!')
          const user : TokenPayload | null = verifyToken(token);
          console.log(`User after decode Token === ${user}`);
          if(user){
              const hashPassword = await bcryptjs.hash(password,10);
              await this._authRepository.resetPassword(user.id,hashPassword);
              return true;
          }else{
            return false;
          }
      }catch(err){
          throw err;
      }
    }
}