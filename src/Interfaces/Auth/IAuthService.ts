import { UserData, UserLogin, LoginResponse } from '../../interface/Interface';
import { TUserData } from '../../Types/user.types';

export interface IAuthService{
   register(userData: UserData):Promise<boolean>
   otpSubmit(userData :TUserData ) : Promise<string>
   resendOtp(userEmail : string):Promise<string>
   login(userData : UserLogin ):Promise<LoginResponse | string>
   getAccessToken(token: string):Promise<string | null>
   forgotPassword(email: string):Promise<boolean>
   resetPassword(token: string, password:string):Promise<boolean>
}