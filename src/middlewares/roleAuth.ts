import { Request, Response, NextFunction } from "express";
import { verifyToken } from '../utils/jwt';
//import { TUserPayload } from '../Types/user.types';

interface AuthRequest extends Request {
     user?: any;
}
export class RoleAuth {
  private secret: string;
  constructor(){
     this.secret = process.env.JWT_SECRET as string;
  }
  public checkRole(roles : string[]){
      return (req: AuthRequest, res: Response, next: NextFunction) =>{
        try{
              const token = req.headers.authorization?.split(' ')[1];
              if(!token){
                console.log(' No token provided !! --- in role auth');
                res.status(403).json({message:'Unauthorized !'});
                return;
              } 
              const decoded = verifyToken(token);
              console.log('role auth ::',decoded);
              if(!roles.includes(req.user.role)){
                   console.log(' No token provided !! --- in role auth-- invalid Token !!',req.user);
                   res.status(403).json({message:'Forbidden : Accesss denied  !'});
                   return;
              }
              next();
        }catch(err){
           res.status(401).json({message:'Invlaid Token !'});
           return;
        }
      }
  }
}