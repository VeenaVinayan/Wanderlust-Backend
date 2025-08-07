import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminService } from '../../Interfaces/Admin/IAdminService';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { s3Service } from '../../config/s3Service';
import { ICategory } from '../../interface/Interface';
import { ICategoryResponse } from '../../interface/Category.interface';
import { FilterParams } from '../../Types/Booking.types';

@injectable()
export class AdminController{
   constructor(
       @inject('IAdminService') private readonly _adminService: IAdminService 
   ){ }
     getAllData = asyncHandler(async(req:Request, res:Response) =>{
      try{
            const {user,perPage ,page} = req.params;
            const search = (req.query.search as string) || '';
            const sortBy = (req.query.sortBy as string) || 'name';
            const sortOrder = (req.query.sortOrder as string) || 'asc';
            const users = await this._adminService.getAllData(user,parseInt(perPage),parseInt(page),search,sortBy,sortOrder);
            res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS ,users});
       }catch(err){
         console.error(err);
         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:StatusMessage.INTERNAL_SERVER_ERROR});
       }
    })

    blockOrUnblock = asyncHandler( async(req:Request,res:Response) =>{
      console.info("Block or unblock User in Controller !",req.body);
      try{
          const { id } = req.body;
          const response = await this._adminService.blockOrUnblock(id);
          if(response){
             res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
          }else{
             res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
          }
      }catch(err){
          throw err;
      }
    })
   getPresignedUrl = asyncHandler(async(req: Request, res: Response) =>{
       const { fileType } = req.body;
       console.log('Get presigned url ::',fileType);
       if(!fileType){
           res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
               .json({message: "File types are required !"});
           return;    
       }
       try{
           const response = await s3Service.generateSignedUrl(fileType);
           console.log('After presigned urls ::',response);
           res.status(HttpStatusCode.OK).json({response});
       }catch(error){
          console.error('Error generating signed Urls:',error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
              .json({message:StatusMessage.INTERNAL_SERVER_ERROR});
       }
   });
   addCategory = asyncHandler( async(req: Request, res: Response) =>{
        try{
            const response = await this._adminService.addCategory(req.body);
            if(response){
                res.status(HttpStatusCode.OK).json({message:StatusMessage.CREATED})
            }else{
                res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR}) 
            }
            
        }catch(err){
           throw err;
        }
    });
   getCategories = asyncHandler( async(req:Request, res: Response)  => {
      try{
          const filterParams : FilterParams ={
            page: Number(req.query.page),
            perPage : Number(req.query.perPage),
            searchParams: {
                 search : (req.query.search as string) || '',
                 sortBy : (req.query.sortBy as string) || 'createdAt',
                 sortOrder : (req.query.sortOrder as string) || 'asc',
            }
          }
          const data  = await this._adminService.getCategories(filterParams);
          res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data});
       }catch(err){
          console.log('Error in get category !');
          throw err;
       }
   })
   deleteCategory = asyncHandler(async (req:Request, res: Response) =>{
         try{
             console.log('Delete category in Controller !!');
             const {categoryId } = req.params;
             const response = await this._adminService.deleteCategory(categoryId);
             console.log(" Result :: ",response);
             if(response){
                 res.status(HttpStatusCode.OK).json({success:true});
             }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:false});
             }
         }catch(err){
             console.log("Error in  Delete Category !! Controller !!",err);
             throw err;
         }
    })
 isCategoryExist = asyncHandler(async (req:Request, res:Response,next:NextFunction)=> {
         try{
              const { categoryName } = req.params;
              const response = await this._adminService.isExistCategory(categoryName);
              if(!response){
                  res.status(HttpStatusCode.OK).json({success:true});
              }else{
                  res.status(HttpStatusCode.CONFLICT).json({success:false});
              }
         }catch(err){
            next(err);
         }
    })
 editCategory = asyncHandler(async (req:Request, res:Response,next:NextFunction) =>{
         try{
            const { categoryId } = req.params;
            const  category  = req.body;
            const response = await this._adminService.editCategory(categoryId,category);
            if(response){
                 res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS})
            }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
            }
         }catch(err){
            console.log("Error in Edit Cateory Controler ||");
            next(err);
         }
    })
    pendingAgentData = asyncHandler(async (req:Request, res: Response,next: NextFunction) =>{
         try{
            const { perPage, page} = req.params;
            const filterParams : FilterParams ={
            page: Number(req.query.page),
            perPage : Number(req.query.perPage),
            searchParams: {
                 search : (req.query.search as string) || '',
                 sortBy : (req.query.sortBy as string) || 'createdAt',
                 sortOrder : (req.query.sortOrder as string) || 'desc',
            }
          }
             const agentData = await this._adminService.getPendingAgentData(filterParams);
             console.log("Agent Data :",agentData);
             res.status(HttpStatusCode.OK).json({success:true,agentData});
         }catch(err){
             console.log('Error in Fetch Pending Agent Data !');
             next(err);
         }
    })
    agentApproval = asyncHandler(async (req: Request, res: Response,next:NextFunction) =>{
         try{
             const { agentId } = req.params;
             const result = await this._adminService.agentApproval(agentId);
             if(result){
                 res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
             }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:StatusMessage.ERROR});
             }
         }catch(err){
            next(err);
         }
    })
    rejectAgentRequest = asyncHandler(async (req: Request, res: Response,next: NextFunction) =>{
        try{
            const { agentId } = req.params;
            const result = await this._adminService.rejectAgentRequest(agentId);
            if(result){
                res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
            }else{
                res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:StatusMessage.ERROR});
            }
        }catch(err){
           next(err);
        }
   })
   blockPackage = asyncHandler( async (req: Request, res: Response,next : NextFunction) => {
      try{
           console.log(" Block Package ! by Admin");
           const {packageId} = req.params;
           const result = await this._adminService.blockPackage(packageId);
           if(result){
             res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS})
           }else{
             res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.ERROR});
           }
      }catch(err){
         next(err);
      }   
   })
 }
 
