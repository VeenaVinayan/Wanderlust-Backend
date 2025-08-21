import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../../Interfaces/User/IUserService';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import stripeService from '../../config/stripePayment';
import { FilterParams } from '../../Types/Booking.types';
import { IAgentChatDataDTO } from '../../DTO/userDTO';

@injectable()
export class UserController{
     constructor(
        @inject('IUserService') private readonly _userService: IUserService
    ){}
   public userProfile (){
     console.log('UserProfile !')
   }
   updateProfile = asyncHandler( async(req: Request, res: Response,next: NextFunction)  =>{
    try{
      const { name, phone } = req.body;
      const  userId  = req.params.userId;
      const data  = await this._userService.updateUser(userId,name,phone);
      if(data){
         res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
      }else{
          res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR});
      }
   }catch(err){
      next(err);
   }
  })
 resetPassword = asyncHandler(async (req: Request, res: Response,next : NextFunction) => {
  try {
    const response = await this._userService.resetPassword(req);
    switch (response) {
      case 1:
        res.status(HttpStatusCode.BAD_REQUEST).json({error:true, message: StatusMessage.OLD_PASSWORD_INCORRECT });
        return
      case 2:
        res.status(HttpStatusCode.OK).json({success:true, message: StatusMessage.PASSWORD_RESET_SUCCESS });
         return;
      case 3:
        res.status(HttpStatusCode.BAD_REQUEST).json({error:true, message: StatusMessage.PASSWORD_MISMATCH });
         return;
      case 4:
        res.status(HttpStatusCode.NOT_FOUND).json({ error:true, message: StatusMessage.USER_NOT_FOUND });
         return;
       default:
         res.status(HttpStatusCode.OK).json({error:true, message: StatusMessage.PASSWORD_RESET_SUCCESS });
    }
  } catch (err) {
    next(err);
  }
});

 getCategories = asyncHandler( async (req:Request, res: Response, next: NextFunction) =>{
      try{
            const data = await this._userService.getCategories();
            if(data){
               res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
            }else{
               res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR});
            }
      }catch(err){
         next(err);
      }
  })
  getPackages = asyncHandler(async (req:Request, res: Response,next:NextFunction) =>{
      try{
          const data = await this._userService.getPackages();
          if(data){
            res.status(HttpStatusCode.OK).json({message: StatusMessage.SUCCESS,data});
          }else{
            res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR,data});
          }
      }catch(err){
         next(err);
      }
  })
  stripePayment = asyncHandler(async (req:Request, res: Response,next:NextFunction) =>{
      try{
          const { price, packageName } = req.body;
          const data = await stripeService.createCheckoutSession({price,packageName});
          if(data){
            res.status(HttpStatusCode.OK).json({message: StatusMessage.SUCCESS,data});
          }else{
            res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR,data});
          }
      }catch(err){
        next(err);
      }
  });
  addReview = asyncHandler(async (req: Request, res: Response,next:NextFunction) =>{
     try{
        const { reviewData } = req.body;
        const result = await this._userService.addReview(reviewData);
        if(result){
           res.status(HttpStatusCode.CREATED).json({message:StatusMessage.SUCCESS});
        }else{
           res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
        }
     }catch(err){
        next(err);
     }
  });
  getReview = asyncHandler(async(req: Request, res: Response,next:NextFunction) => {
     try{
           const { userId, packageId  } = req.query;
           const review  = await this._userService.getReview(String(userId),String(packageId));
           if(review){
              res.status(HttpStatusCode.OK).json({succes:true,data:review});
           }else{
              res.status(HttpStatusCode.NO_CONTENT).json({success:true});
           }
     }catch(err){
         next(err);
     }
  });
  deleteReview = asyncHandler(async (req:Request, res: Response,next:NextFunction) =>{
     try{
         const { reviewId } = req.query;
         if(!reviewId){
             res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.BAD_REQUEST})
         }
         const result = await this._userService.deleteReview(String(reviewId));
         if(result){
             res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
         }else{
             res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:StatusMessage.NOT_FOUND});
         }
     }catch(err){ 
       next(err);
   }
 });
 getReviews = asyncHandler(async(req:Request, res: Response,next:NextFunction) =>{
    try{
       const { packageId } = req.params;
       if(!packageId){
           res.status(HttpStatusCode.BAD_REQUEST).json({error:true, message:StatusMessage.BAD_REQUEST});
           return;
       }
       const data = await this._userService.getReviews(packageId);
       res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
    }catch(err){
       next(err);
    }
 });
 getWallet  = asyncHandler(async (req: Request, res: Response,next:NextFunction) =>{
    try{
        const { userId } = req.params;
        const { page, perPage, search, sortBy, sortOrder } = req.query;
        const filterParams : FilterParams = {
            id: userId,
            page:Number(page),
            perPage:Number(perPage),
            searchParams: {
                 search : ( search as string )|| '',
                 sortBy : 'createdAt',
                 sortOrder :(sortOrder as string ) || '',
            }
        }
        if(!userId){
            res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({message:StatusMessage.BAD_REQUEST});
            return;
        }
        const data =  await this._userService.getWallet(userId,filterParams);
        res.status(HttpStatusCode.OK).json({success:true,data});
    }catch(err){
       next(err);
    }
 });
 editReview = asyncHandler(async(req: Request, res: Response,next:NextFunction) =>{
   try{
       const { review ,rating} = req.body;
       const { reviewId  } = req.params;
       if(!reviewId || !review || !rating){
           res.status(HttpStatusCode.BAD_REQUEST).json({error:true,message:StatusMessage.BAD_REQUEST});
           return;
       }
       const result = await this._userService.editReview({review,rating},reviewId);
       if(result){
           res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.UPDATE_SUCCESS});
       }else{
           res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.UPDATE_FAILED});
       }
   }catch(err){
      next(err);
   }
 }
);
getUserDetails = asyncHandler(async (req: Request, res: Response,next:NextFunction) =>{
    try{
        const { userId } = req.params;
        const data : IAgentChatDataDTO | null = await this._userService.userDetails(userId);
        res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data});
    }catch(err){
        next(err);
    }
})
}