import bcryptjs from 'bcryptjs';
import authRepository from '../repositories/authRepository';
import sendMail from '../utils/mailSender';
import { UserData , UserOtp, OtpData, UserLogin, LoginResult, LoginResponse, TokenPayload} from '../interface/Interface';
import OtpHelper from '../helper/otpHelper';
import EmailHelper from '../helper/emailHelper';
import { generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken} from '../utils/jwt';
import { Types, Document } from 'mongoose';
import { IAgent, IAgentResponse } from '../interface/Agent';

const authService = {
  register: async (userData: UserData) => {
    console.log("Service ... user Data ::", userData);
    const {  email } = userData;
    const isUserExist : LoginResult| null= await authRepository.isUserExist(email);
    const res: { user: boolean | null; otp?: string; time?: Date } = { user: isUserExist? true:false };
    
    console.log("User Response :: ", res);
    if (isUserExist === null) {
      const otp:string = OtpHelper.generateOtp();
      console.log("Otp is ::", otp);
      res.otp = otp;
      res.time = new Date();
      const body = OtpHelper.generateEmailBody(otp);
      sendMail(email, "OTP Verification", body);
      authRepository.saveOtp(email, otp);
      console.log(res);
    }
    return res;
  },
 otpSubmit: async (userData :any) : Promise<string> => {
    try {
       console.log("Otp submit service !!");
       const {otp, data, user} = userData; 
       console.log("User data on otp :: ",JSON.stringify(userData));
       const { name, email, phone, password } = data || {name:"",email:"",phone:"",password:"",address:""};
       const otpUser :string = userData.otp || " ";
   
      const otpValue : UserOtp | null=  await authRepository.getOtp(email);  
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
          const res : Document= await authRepository.registerUser(User);
          console.log("Agent Data ::",res);
           if(user === "Agent" && typeof res._id ){
              const Agent :IAgent= {
                  userId: res._id as Types.ObjectId,
                  address:{
                       home: data.house,
                       street: data.street,
                       city: data.city,
                       state:data.state,
                       country:data.country,
                       zipcode:data.zipcode,
                  }, 
              }
              console.log(" Data agent ::",Agent);
              await authRepository.registerAgent(Agent); 
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
  }, 

  resendOtp: async (userEmail :string) : Promise<String> =>{
    try{
        console.log("Resend OTP ");
        const otpNew = OtpHelper.generateOtp();
        const body = OtpHelper.generateEmailBody(otpNew);
        sendMail(userEmail, "OTP Verification", body);
        authRepository.saveOtp(userEmail, otpNew);
        const dataOtp : OtpData ={
            email:userEmail,
            otp:otpNew,
        }
        const data = authRepository.updateOtp(dataOtp)
        return data;
    }catch(err){
        throw err;
    }
  },
  login: async (userData: UserLogin) : Promise<LoginResponse | string >=> {
    try{
      console.log('Auth Services !!', userData);
      let res : LoginResponse;
      let response : LoginResult | null = await authRepository.login(userData.email);
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
                  const agent : IAgentResponse | null = await authRepository.getAgentData(response.id.toString());
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
   },
   getAccessToken: async (token : string) :Promise<string | null> =>{
        const accessToken = verifyRefreshToken(token);
        if(accessToken){
            return accessToken
        }else{
           return null;
        }
    },
   forgotPassword: async (email: string) :Promise<boolean> =>{
      console.log('Forgot password Service !');
      const user = await authRepository.isUserExist(email);
      if(user){
        const userId : TokenPayload ={
           id: user.id,
           role:user.role,
       }
        const token = generateAccessToken(userId);
        const body = EmailHelper.generateEmailBody(token);
        sendMail(email,"Reset Password",body);
        return true;
      }else{
        return false;
      }
   },
   resetPassword: async (token : string , password : string) :Promise<boolean> =>{
      try{
          console.log('Reset password SErvice !!')
          const user : TokenPayload | null = verifyToken(token);
          console.log(`User = ${user}`);
          if(user){
              const hashPassword = await bcryptjs.hash(password,10);
              const res = await authRepository.resetPassword(user.id,hashPassword);
              console.log(' Reset password ::',res);
              return true;
          }else{
            return false;
          }
      }catch(err){
          throw err;
      }
    }
 };
export default authService;
            
             
         

        
    
