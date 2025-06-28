import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interface/Interface';
import {Types} from 'mongoose';

export const generateAccessToken =  (payload: TokenPayload): string =>{
    if(!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
         throw "Invalid expiry !!";
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{
         expiresIn:process.env.JWT_EXPIRES_IN,
    })
}
export const generateRefreshToken = (payload : TokenPayload): string =>{
    if(!process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES_IN){
        throw "Invalid expiry !!";
    }
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,
    {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN});
}
export const verifyToken = (token : string) =>{
    try{
        console.log("Token before verfication ::");
        const jwtSecret: string= process.env.JWT_SECRET || "travel123456";
        const decoded =  jwt.verify(token,jwtSecret) as jwt.JwtPayload;
        console.log(`After verify token is :: ${JSON.stringify(decoded)}`);
        if (decoded && typeof decoded === "object" &&  "id" in decoded) {
            const payload : TokenPayload= { 
            id: decoded.id,
            role:decoded.role
         };
            return payload;
        }else{
             return null;
        }
    }catch(err:unknown){
        if(err instanceof jwt.TokenExpiredError){
            console.error("TokenExpired Error : Refresh token expired !");
       }else if(err instanceof jwt.JsonWebTokenError){
           console.error("JsonWebTokenError :Invalid Token Error !")
       }else{
           console.error('Error verifying refresh Token !');
       }
       return null;
    }
}
export const verifyRefreshToken = (token : string) : any =>{
    try {
        console.log('Verifying Refresh Token:', token);
        
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is missing in environment variables.');
        }

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        if (decoded && decoded.id && decoded.role) {
            console.log('Decoded Token:', decoded);
            const payload = {
                id: decoded.id,
                role: decoded.role,
            };
            const accessToken = generateAccessToken(payload);
            console.log("Access Token ::", accessToken);
            return accessToken;
        } else {
            console.error("Invalid Token: Missing payload data.");
            return null;
        }
    } catch (err: unknown) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error("TokenExpiredError: Refresh token expired!", err.message);
        } else if (err instanceof jwt.JsonWebTokenError) {
            console.error("JsonWebTokenError: Invalid Refresh Token!", err.message);
        } 
                
        return null;
    }
    
}


