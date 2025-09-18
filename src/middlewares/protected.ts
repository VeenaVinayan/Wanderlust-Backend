import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../interface/Interface';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';
import { StatusMessage } from '../enums/StatusMessage';
import { HttpStatusCode } from '../enums/HttpStatusCode';

interface AuthenticatedRequest extends Request {
     user?: {
          _id:string;
          role:string;
     }; 
}
const auth = async (req: AuthenticatedRequest, res:Response, next: NextFunction) =>{
     try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
             res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
             return;
        }
        try{
             const payload = verifyToken(token) as TokenPayload;
             const user = await User.findById(payload.id);
             if(!user){ 
                res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
                return
             }
             req.user = user;
             next();
        }catch(err){
             res.status(HttpStatusCode.UNAUTHORIZED).json({message:StatusMessage.INVALID_TOKEN});
             next (err);
             return;
        }
     }catch(err){
        console.error(err);
        next(err);
     }
}

export default auth;