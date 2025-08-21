import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminService } from '../../Interfaces/Admin/IAdminService';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { s3Service } from '../../config/s3Service';
import { FilterParams } from '../../Types/Booking.types';
import { TCategoryResult } from '../../interface/Category.interface';
import { TCategoryDTO } from '../../DTO/categoryDTO';
import categoryMapper from '../../mapper/categoryMapper';
@injectable()
export class AdminController{
   constructor(
       @inject('IAdminService') private readonly _adminService: IAdminService 
   ){ }
     getAllData = asyncHandler(async(req:Request, res:Response,next: NextFunction) =>{
      try{
            const {user,perPage ,page} = req.params;
            const search = (req.query.search as string) || '';
            const sortBy = (req.query.sortBy as string) || 'name';
            const sortOrder = (req.query.sortOrder as string) || 'asc';
            const users = await this._adminService.getAllData(user,parseInt(perPage),parseInt(page),search,sortBy,sortOrder);
            res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS ,users});
       }catch(err){
         console.error(err);
         next(err);
       }
    })

    blockOrUnblock = asyncHandler( async(req:Request,res:Response,next:NextFunction) =>{
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
          next(err);
      }
    })
   getPresignedUrl = asyncHandler(async(req: Request, res: Response,next:NextFunction) =>{
       const { fileType } = req.body;
       console.log('Get presigned url ::',fileType);
       if(!fileType){
           res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
               .json({message: "File types are required !"});
           return;    
       }
       try{
           const response = await s3Service.generateSignedUrl(fileType);
           res.status(HttpStatusCode.OK).json({response});
       }catch(err){
         next(err);
       }
   });
   addCategory = asyncHandler( async(req: Request, res: Response,next:NextFunction) =>{
        try{
            const response = await this._adminService.addCategory(req.body);
            if(response){
                res.status(HttpStatusCode.OK).json({message:StatusMessage.CREATED})
            }else{
                res.status(HttpStatusCode.NO_CONTENT).json({message:StatusMessage.ERROR}) 
            }
            
        }catch(err){
           next(err);
        }
    });
   getCategories = asyncHandler( async(req:Request, res: Response,next:NextFunction)  => {
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
          const result : TCategoryResult = await this._adminService.getCategories(filterParams);
          const categories : TCategoryDTO[] = categoryMapper.categoryMapper(result.categories);
          const data = {
             categories,
             totalCount:result.totalCount,
          }
          res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data});
       }catch(err){
          next(err);
       }
   })
   deleteCategory = asyncHandler(async (req:Request, res: Response,next:NextFunction) =>{
         try{
            const {categoryId } = req.params;
             if(!categoryId){
                 res.status(HttpStatusCode.BAD_REQUEST).json({meessage:StatusMessage.MISSING_REQUIRED_FIELD})
             }
             const response = await this._adminService.deleteCategory(categoryId);
             if(response){
                 res.status(HttpStatusCode.OK).json({success:true});
             }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:false});
             }
         }catch(err){
             next(err);
         }
    })
 isCategoryExist = asyncHandler(async (req:Request, res:Response,next:NextFunction)=> {
         try{
              const { categoryName } = req.params;
              if(!categoryName){
                 res.status(HttpStatusCode.BAD_REQUEST).json({meessage:StatusMessage.MISSING_REQUIRED_FIELD})
              }
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
            if(!categoryId){
                 res.status(HttpStatusCode.BAD_REQUEST).json({meessage:StatusMessage.MISSING_REQUIRED_FIELD})
             }
            const  category  = req.body;
            const response = await this._adminService.editCategory(categoryId,category);
            if(response){
                 res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS})
            }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
            }
         }catch(err){
            next(err);
         }
    })
pendingAgentData = asyncHandler(async (req:Request, res: Response,next: NextFunction) =>{
         try{
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
             res.status(HttpStatusCode.OK).json({success:true,agentData});
         }catch(err){
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
 
