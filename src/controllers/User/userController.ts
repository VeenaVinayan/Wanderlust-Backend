import { Request, Response } from 'express';
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
   updateProfile = asyncHandler( async(req: Request, res: Response)  =>{
    try{
      console.log('UPdate User profile !!');
      const { name, phone } = req.body;
      const  userId  = req.params.id;
      console.log("User id is ",userId);
      const data  = await this._userService.updateUser(userId,name,phone);
      if(data){
         res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
      }else{
          res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR});
      }
   }catch(err){
      throw err;
   }
  })
 resetPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('Reset password !!');
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
    throw err;
  }
});

 getCategories = asyncHandler( async (req:Request, res: Response) =>{
      try{
            const data = await this._userService.getCategories();
            if(data){
               res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
            }else{
               res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR});
            }
      }catch(err){
           console.log("Error in Get Categories !!",err);
           throw err;
      }
  })
  getPackages = asyncHandler(async (req:Request, res: Response) =>{
      try{
           
          const data = await this._userService.getPackages();
          if(data){
            res.status(HttpStatusCode.OK).json({message: StatusMessage.SUCCESS,data});
          }else{
            res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR,data});
          }
      }catch(err){
         console.log('Error in Get Packages !!');
         throw err;
      }
  })
  stripePayment = asyncHandler(async (req:Request, res: Response) =>{
      try{
          const { price, packageName } = req.body;
          console.log("Booking Data ::",req.body);
          const data = await stripeService.createCheckoutSession({price,packageName});
          if(data){
            res.status(HttpStatusCode.OK).json({message: StatusMessage.SUCCESS,data});
          }else{
            res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR,data});
          }
      }catch(err){
         console.log('Error in Stripe Payment !!');
         throw err;
      }
  });
  addReview = asyncHandler(async (req: Request, res: Response) =>{
     try{
        const { reviewData } = req.body;
        console.log('Values in add Review ::',reviewData);
        const result = await this._userService.addReview(reviewData);
        if(result){
           res.status(HttpStatusCode.CREATED).json({message:StatusMessage.SUCCESS});
        }else{
           res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
        }
     }catch(err){
        throw err;
     }
  });
  getReview = asyncHandler(async(req: Request, res: Response) => {
     try{
           console.log('Get Review controller !!');
           const { userId, packageId  } = req.query;
           const review  = await this._userService.getReview(String(userId),String(packageId));
           if(review){
              res.status(HttpStatusCode.OK).json({succes:true,data:review});
           }else{
              res.status(HttpStatusCode.NO_CONTENT).json({success:true});
           }
     }catch(err){
         throw err;
     }
  });
  deleteReview = asyncHandler(async (req:Request, res: Response) =>{
     try{
         const { reviewId } = req.query;
         console.log('Delete REview !!',reviewId);
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
       throw err;
   }
 });
 getReviews = asyncHandler(async(req:Request, res: Response) =>{
    try{
       const { packageId } = req.params;
       console.log('DAta in get Reviews ::',packageId);
       if(!packageId){
           res.status(HttpStatusCode.BAD_REQUEST).json({error:true, message:StatusMessage.BAD_REQUEST});
           return;
       }
       const data = await this._userService.getReviews(packageId);
       res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
    }catch(err){
       throw err;
    }
 });
 getWallet  = asyncHandler(async (req: Request, res: Response) =>{
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
       throw err;
    }
 });
 editReview = asyncHandler(async(req: Request, res: Response) =>{
   try{
       const { review ,rating} = req.body;
       const { reviewId  } = req.params;
       console.log('Data in edit Review ::',review, rating,reviewId);
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
      throw err;
   }
 }
);
getUserDetails = asyncHandler(async (req: Request, res: Response) =>{
    try{
        const { userId } = req.params;
        const data : IAgentChatDataDTO | null = await this._userService.userDetails(userId);
        res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data});
    }catch(err){
        throw err;
    }
})
}