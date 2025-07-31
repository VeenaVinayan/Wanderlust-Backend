import { UserData, UserLogin, LoginResponse } from '../../interface/Interface';

export interface IAuthService{
   register(userData: UserData):Promise<boolean>
   otpSubmit(userData : any) : Promise<string>
   resendOtp(userEmail : string):Promise<string>
   login(userData : UserLogin ):Promise<LoginResponse | string>
   getAccessToken(token: string):Promise<string | null>
   forgotPassword(email: string):Promise<boolean>
   resetPassword(token: string, password:string):Promise<boolean>
}