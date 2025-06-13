
export interface IAuthRepository{
     isUserExist(email:string):Promise<any>;
     saveOtp(email:string,otp:string):Promise<void>;
     getOtp(email:string):Promise<void>;
}