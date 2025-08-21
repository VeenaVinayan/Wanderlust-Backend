import { Request, Response } from 'express';
import { inject, injectable} from 'inversify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { IAuthService } from '../../Interfaces/Auth/IAuthService';
import { LoginResponse } from '../../interface/Interface';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import {  GoogleService } from '../../services/googleService';
import { TokenPayload } from '../../interface/Interface';

@injectable()
export class AuthController{
   constructor(
      @inject('IAuthService') private readonly _authService : IAuthService
   ){}

   register = asyncHandler(async (req: Request, res: Response) => {
    try {
      const  user  = await this._authService.register(req.body);
      if (user) {
         res.status(HttpStatusCode.CONFLICT).json({
          error: true,
          message: StatusMessage.CONFLICT
        });
      }else {
        res.status(HttpStatusCode.OK).json({
          success: true,
          message: StatusMessage.SENT_MAIL,
        });
      }
    } catch (error) {
      throw error;
    }
});
otpSubmit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await this._authService.otpSubmit(req.body);
        if(response === "success"){
           res.status(HttpStatusCode.CREATED).json({success:true,message:StatusMessage.CREATED});
       }
       if(response === "error"){
          res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.INVALID_OTP})
       }
    }catch(err){
       throw err;
    }
  });
 resendOtp = asyncHandler(async(req:Request, res: Response): Promise <void> =>{
     try{
        const response = await this._authService.resendOtp(req.body.email);
        res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SENT_MAIL});
     }catch(err){
         throw err;
     }
  });
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const response: LoginResponse | string = await this._authService.login(req.body);
        if (typeof response === "string") {
          if(response ==="User"){ 
            res.status(HttpStatusCode.FORBIDDEN).json({ error: true, message: StatusMessage.NOT_FOUND });
            return;
          }else if(response === "Blocked"){
            res.status(403).json({ error: true, message: StatusMessage.BLOCKED });
            return;
         }else{
            res.status(HttpStatusCode.FORBIDDEN).json({success:false,message:StatusMessage.INVALID_CREDENTIALS})
         }
       }
        if(typeof response === "object") {
            res.cookie("token", response.refreshToken, {
                httpOnly: true,
                sameSite:"none",
                secure:true,
                maxAge: 10 * 24 * 60 * 60 * 1000, 
            });
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: StatusMessage.LOGIN_SUCCESS,
                data:response,
            });
            return;
        }
    } catch (err) {
        throw err;
    }
 });
 getAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
       if (!req.cookies || !req.cookies.token) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.REFRESH_TOKEN_MISSING});
            return;
        }
        const refreshToken = req.cookies.token;
        const accessToken = await this._authService.getAccessToken(refreshToken);
       if (accessToken) {
            res.status(HttpStatusCode.OK).json({ success: true, accessToken });
        } else {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ error: true, message:StatusMessage.REFRESH_TOKEN_EXPIRY });
        }
    } catch (error) {
        console.error("Error in refresh token controller:", error);
        throw error;
    }
  })
  logout = asyncHandler(async (req:Request, res: Response) :Promise<void> =>{
    res.clearCookie('token',{
        httpOnly: true,
        sameSite:"none",
        secure:true,
        }) 
     res.status(HttpStatusCode.NO_CONTENT).json({success:true,message:StatusMessage.LOGOUT_SUCCESS});
  });
 forgotPassword = asyncHandler(async(req:Request,res:Response) : Promise<void> =>{
    const { email } = req.body;
    if(!email){
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.MISSING_REQUIRED_FIELD});
      return;
    }
   const response = await this._authService.forgotPassword(email);
    if(response){
      res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SENT_MAIL});
    }else{
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.INVALID_CREDENTIALS});
    }
  })
  resetPassword = asyncHandler(async(req:Request, res: Response) :Promise<void> =>{
     const {password,token } = req.body;
     const response = await this._authService.resetPassword(token,password)
     if(response){
         res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
     }else{
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({success:false,message:StatusMessage.TOKEN_EXPIRED});
     }
  });
  googleAuth = asyncHandler(async( req:Request, res: Response) : Promise<void> => {
        try{
           const  {  code  } = req.query;
           const googleService = new GoogleService();
           if(!code){
              res.status(HttpStatusCode.FORBIDDEN).json({
                  message: StatusMessage.FORBIDDEN
               })
           }
          const payload = await googleService.googleAuth(String(code));
           if(!payload){
               res.status(HttpStatusCode.UNAUTHORIZED).json({
               message:'INvalid Google Token'
             });
             return;
           }
          const payloadJwt : TokenPayload= {
              id:payload.id.toString(),
              role:payload.role,
           }
           const accessToken = generateAccessToken(payloadJwt);
           const refreshToken =generateRefreshToken(payloadJwt);
           res.cookie("token", refreshToken, {
            httpOnly: true,
            sameSite:"none",
            secure:true,
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });
         const user ={
           id:payload._id,
           name:payload.name,
           email:payload.email,
           phone:payload.phone,
           role:payload.role,
           status:payload.status,
         }
         res.status(HttpStatusCode.OK).json({
             message:StatusMessage.CREATED,data:{
              accessToken,
              user
         }});
        }catch(error){
           throw error;
        }
     })
}
