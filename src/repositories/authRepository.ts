
import User from '../models/User';
import Otp from '../models/Otp';
import Agent from '../models/Agent';
import { UserOtp, OtpData , UserLogin ,LoginResult, TokenPayload } from '../interface/Interface';
import { Types , Document} from 'mongoose';
import { IAgent , IAgentResponse } from '../interface/Agent';

const authRepository = {
  isUserExist: async (email: string): Promise< any > => {
    try {
      console.log("Inside Repository !!");
      const user  = await User.findOne({ email:email });
      console.log("After find  ::", user);
      return user;
    } catch (err) {
      console.error('Error occurred ::', err);
      throw err;
    }
  },

  registerUser: async (userData: Record<string, any>): Promise<Document> => {
    try {
      console.log('Register user in repository !!!');
      const user = new User(userData);
      return await user.save();
    } catch (err) {
      console.error("Error occurred in registerUser!", err);
      throw err;
    }
  },
  
 saveOtp: async ( email: string, otp : string) : Promise <void> =>{
      try{
         console.log("Save Otp !...");
         const otpData = new Otp({
            email,
            otp
        });
          await otpData.save();
      }catch(err : any){
         console.log(" Error occured : ",err);
         throw err;
      }
  },
  getOtp : async (email : string) : Promise <UserOtp | null> =>{
       try{
           const userOtp : UserOtp | null  = await Otp.findOne({email:email});
           if(!userOtp){
              throw new Error("OTP not found for the given email !")
           }
           return userOtp;
       }catch(err){
           throw err;
       }
  },
  updateOtp : async (otpData : OtpData) : Promise <string> =>{
    try{
         console.log('Auth Repository !!! ');
         const updatedOtp: string = await Otp.findOneAndUpdate(
            { email: otpData.email},
            {
              otp: otpData.otp,
              createdAt : new Date(),
            },
            {upsert: true, new:true}
         );
         return updatedOtp;
    }catch(err){
       throw err;
    }
  },
  login : async(email : string) :Promise <LoginResult | null> =>{
     try{
           console.log('INside Auth Repository !!');
           let user :LoginResult | null;
           console.log(email);
           user = await User.findOne({email:email},
               {_id:1,name:1,email:1,password:1,phone:1,role:1,status:1}
           );  
           console.log(`User :: ${user}`);
           return user;
     }catch(err){
         throw err;
     }
  },
  resetPassword: async (id: string, hashPassword :string) : Promise <void> =>{
   try{
          const result = await User.findByIdAndUpdate(id,
           { password: hashPassword},
           {new : true}
        );
        console.log('Reset password value :: ',result);   
   }catch(err){
        throw err;
   } 
  },
  registerAgent: async(agentData : IAgent):Promise<boolean> =>{
     try{
         console.log('Register Agent ! Repositroy');
         const agent = new Agent(agentData);
         await agent.save();
         return true;
     }catch(err){
         console.log('Error in Register Agent !!'); 
         throw err;
     }
  },
  getAgentData : async(id: string): Promise< IAgentResponse | null > =>{
    try{
          console.log('Get agent data !',id);
          return await Agent.findOne({userId:id},{address:1,isVerified:1,_id:0}).lean();
     }catch(err){
       console.error('Error in agent data fetch');
       throw err;
    }
   },
 };

export default authRepository;
