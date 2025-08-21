import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { verifyToken } from '../utils/jwt';
import { StatusMessage } from "../enums/StatusMessage";
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { IUserPayload } from '../Types/user.types';

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
                res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
                return;
              } 
              const decoded = verifyToken(token);
              if(!roles.includes(req.user.role)){
                   res.status(HttpStatusCode.FORBIDDEN).json({message:StatusMessage.ACCESS_DENIED});
                   return;
              }
              next();
        }catch(err){
           res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.INVALID_TOKEN});
           return;
        }
      }
  }
}


// public checkRole(roles: string[]): RequestHandler {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) {
//         console.log(' No token provided !! --- in role auth');
//         res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.ACCESS_DENIED});
//         return;
//       }
//       const decoded = verifyToken(token);
//       console.log('role auth ::', decoded);
//      const user = decoded as IUserPayload;
//       (req as AuthRequest).user = user;

//       if (!roles.includes(user.role)) {
//         console.log('Access denied !! --- in role auth-- invalid role !!', user);
//         res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.ACCESS_DENIED });
//         return;
//       }

//       next();
//     } catch (err) {
//       res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.INVALID_TOKEN });
//     }
//   };
// }
// }
