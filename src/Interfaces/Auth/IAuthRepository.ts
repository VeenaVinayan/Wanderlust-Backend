import { UserOtp , OtpData, LoginResult} from '../../interface/Interface';
import { IAgentResponse } from '../../interface/Agent';
import { IAgent } from '../../interface/Agent';
import { IBaseRepository } from '../Base/IBaseRepository';
import { IUser } from '../../models/User';

export interface IAuthRepository extends IBaseRepository<IUser>{
    isUserExist(email:string):Promise<LoginResult | null>;
    saveOtp(email: string,otp : string):Promise<void>;
    getOtp(email:string):Promise<UserOtp | null>;
    updateOtp(otpData : OtpData) : Promise<string>
    login(email : string):Promise<LoginResult | null>
    resetPassword(id: string,hashPassword: string):Promise<void>
    registerAgent(agentData : IAgent):Promise<boolean>
    getAgentData(id: string):Promise<IAgentResponse | null>
}