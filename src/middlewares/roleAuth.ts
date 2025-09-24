import { Request, Response, NextFunction } from "express";
import { StatusMessage } from "../enums/StatusMessage";
import { HttpStatusCode } from '../enums/HttpStatusCode';

interface AuthRequest extends Request {
     user?:{
      _id:string;
      role:string;
     };
}
export class RoleAuth {
  constructor(){
   }
  public checkRole(roles : string[]){
      return (req: AuthRequest, res: Response, next: NextFunction) =>{
        try{
              const token = req.headers.authorization?.split(' ')[1];
              if(!token){
                res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
                return;
              } 
              if(!req.user?.role || !roles.includes(req.user.role)){
                   res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
                   return;
              }
              next();
        }catch(err){
           console.log(err);
           res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.INVALID_TOKEN});
           return;
        }
      }
  }
}

