"use strict";
// import { Request, Response } from 'express';
// import authService from '../services/authService';
// import { LoginResponse } from '../interface/Interface';
// import {  GoogleService } from '../services/googleService';
// import { HttpStatusCode } from  '../enums/HttpStatusCode';
// import { StatusMessage } from '../enums/StatusMessage';
// import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
// import { TokenPayload } from '../interface/Interface';
// const authController = {
//   register: async (req: Request, res: Response): Promise<void> => {
//     try {
//       console.log('IN authController !!', req.body);
//       const { user, otp, time } = await authService.register(req.body);
//       if (user) {
//          res.status(409).json({
//           error: true,
//           message: 'Already registered Email, Try another one!'
//         });
//       }else {
//         res.status(200).json({
//           success: true,
//           message: 'OTP successfully sent!',
//         });
//       }
//     } catch (error) {
//       console.error('Error in register:', error);
//       res.status(500).json({
//         error: true,
//         message: 'Internal Server Error',
//       });
//     }
//   },
//   otpSubmit: async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log('Otp Submit Controller', req.body);
//         const response = await authService.otpSubmit(req.body);
//         if(response === "success"){
//            res.status(201).json({success:true,data: 'Successfully registered!'})
//        }
//        if(response === "error"){
//           res.status(400).json({success:false,data:"Invalid OTP !"})
//        }
//     }catch(err){
//        console.error('Error in otpSubmit:', err);
//        res.status(500).json({error: true,data: 'Internal Server Error'});
//     }
//   },
//   agentRegister: async(req:Request, res:Response):Promise<void> =>{
//     console.log("Agent Register Controller ! ");
//   },
//   resendOtp: async(req:Request, res: Response): Promise <void> =>{
//      try{
//         const response = await authService.resendOtp(req.body.email);
//         console.log(" Resend otp ::",response)
//         res.status(200).json({success:true,data:"Otp sent successfully ! "});
//      }catch(err){
//         res.status(500).json({error:true,data:"Internal SErver Error !"});
//      }
//   },
//   login: async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log("Login Controller! Values:");
//         const response: LoginResponse | string = await authService.login(req.body);
//         if (typeof response === "string") {
//           if(response ==="User"){ 
//             res.status(HttpStatusCode.FORBIDDEN).json({ error: true, message: StatusMessage.NOT_FOUND });
//             return;
//           }else if(response === "Blocked"){
//             res.status(403).json({ error: true, message: StatusMessage.BLOCKED });
//             return;
//          }else{
//             res.status(HttpStatusCode.FORBIDDEN).json({success:false,message:StatusMessage.INVALID_CREDENTIALS})
//          }
//        }
//         if(typeof response === "object") {
//             res.cookie("token", response.refreshToken, {
//                 httpOnly: true,
//                 sameSite:"none",
//                 secure:true,
//                 maxAge: 10 * 24 * 60 * 60 * 1000, // 30 days
//             });
//             res.status(200).json({
//                 success: true,
//                 message: "Successfully logged in!",
//                 data:response,
//             });
//             return;
//         }
//     } catch (err) {
//         console.error("Error in login controller:", err);
//         res.status(500).json({ error: true, message: "Internal server error!" });
//     }
//  },
//  getAccessToken : async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log("Refresh Token Controller!");
//         if (!req.cookies || !req.cookies.token) {
//             res.status(401).json({ message: "Refresh Token is missing!" });
//             return;
//         }
//         const refreshToken = req.cookies.token;
//         console.log("Refresh Token:", refreshToken);
//         const accessToken = await authService.getAccessToken(refreshToken);
//         if (accessToken) {
//             res.status(200).json({ success: true, accessToken });
//         } else {
//             res.status(401).json({ error: true, message: "Refresh Token Expired or Invalid!" });
//         }
//     } catch (error) {
//         console.error("Error in refresh token controller:", error);
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
//   },
//    logout: async (req:Request, res: Response) :Promise<void> =>{
//      console.log('Logout countroller !');
//      res.clearCookie('token');
//      res.status(200).json({success:true,message:'succesfully Logout!'})
//   },
//   forgotPassword: async(req:Request,res:Response) : Promise<void> =>{
//     const { email } = req.body;
//     console.log('Forgot Password controller : Email !',email);
//     const response = await authService.forgotPassword(email);
//     if(response){
//        res.status(200).json({success:true,message:'Successfully eamil sent !!'});
//     }else{
//        res.status(200).json({success:false,message:'Invalid email !!'});
//     }
//   },
//   resetPassword : async(req:Request, res: Response) :Promise<void> =>{
//      console.log(" Reset password Controller !",req.body);
//      const {password,token } = req.body;
//      const response = await authService.resetPassword(token,password)
//      if(response){
//          res.status(200).json({success:true,message:'Successfully reset password !'});
//      }else{
//         res.status(401).json({success:false,message:'Error occured !'});
//      }
//   },
//    googleAuth: async( req:Request, res: Response) : Promise<void> => {
//       try{
//          const  { code } = req.query;
//          console.log('Google auth....',code);
//          const googleService = new GoogleService();
//          if(!code){
//             res.status(HttpStatusCode.FORBIDDEN).json({
//                 message: StatusMessage.FORBIDDEN
//              })
//          }
//          const payload = await googleService.googleAuth(code);
//          if(!payload){
//              res.status(HttpStatusCode.UNAUTHORIZED).json({
//              message:'INvalid Google Token'
//            });
//            return;
//          }
//          const payloadJwt : TokenPayload= {
//             id:payload.id.toString(),
//             role:payload.role,
//          }
//          const accessToken = generateAccessToken(payloadJwt);
//          const refreshToken =generateRefreshToken(payloadJwt);
//          console.log("Token ::: ",accessToken,refreshToken);
//          res.cookie("token", refreshToken, {
//           httpOnly: true,
//           sameSite:"none",
//           secure:true,
//           maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//       });
//        const user ={
//          id:payload._id,
//          name:payload.name,
//          email:payload.email,
//          phone:payload.phone,
//          role:payload.role,
//          status:payload.status,
//        }
//        console.log('User data ::',user);
//        res.status(HttpStatusCode.OK).json({
//            message:StatusMessage.CREATED,data:{
//             accessToken,
//             user
//        }});
//       } catch(error){
//          console.error('Google Auth error :',error);
//          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
//            message:StatusMessage.INTERNAL_SERVER_ERROR
//          })
//       }
//    }
//  };
// export default authController;
