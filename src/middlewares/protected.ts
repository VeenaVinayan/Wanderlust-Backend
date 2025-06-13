import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../interface/Interface';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
     user?: any; 
}
const auth = async (req: AuthenticatedRequest, res:Response, next: NextFunction) =>{
     try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
             res.status(403).json({message:'Access denied. No token provided !'});
             return;
        }
        try{
             let payload = verifyToken(token) as TokenPayload;
             const user = await User.findById(payload.id);
             if(!user){ 
                res.status(403).json({message:'Access denied. No User provided !'});
                return
             }
             req.user = user;
             next();
        }catch(err){
             res.status(401).json({message:'Invalid Token !'});
             return;
        }
     }catch(err){
        console.error(err);
     }
}

export default auth;