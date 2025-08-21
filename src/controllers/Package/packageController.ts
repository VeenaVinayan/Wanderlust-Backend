import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode  } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { IPackageService } from '../../Interfaces/Package/IPackageService';
import asyncHandler from 'express-async-handler';
import { TPackageResult} from '../../Types/Package.types';
import { FilterParams } from '../../Types/Booking.types';
import packageMapper from "../../mapper/packageMapper";
import { TPackageDataDTO } from '../../DTO/packageDTO';
@injectable()
export class PackageController{
    constructor(
        @inject('IPackageService') private readonly _packageService: IPackageService
    ){}
    addPackage = asyncHandler(async (req:Request, res:Response,next:NextFunction) =>{
         try{
            const data = await this._packageService.addPackage(req.body);
             if(data){
                res.status(HttpStatusCode.CREATED).json(StatusMessage.CREATED);
             }else{
                res.status(HttpStatusCode.NOT_FOUND).jsonp(StatusMessage.ERROR);
             }
         }catch(err){
             next(err);
         }
    })
    editPackage = asyncHandler( async(req:Request, res:Response,next:NextFunction) =>{
         try{
              const { packageId } = req.params;
              const  packageData  = req.body;
              const result = await this._packageService.editPackage(packageId,packageData);
              if(result){
                 res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
              }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
              }
         }catch(err){
            next(err);
         }
    })
    deletePackage = asyncHandler( async(req:Request, res:Response,next:NextFunction) =>{
         try{
            const { packageId } = req.params;
            const response = await this._packageService.deletePackage(packageId);
            if(response){
                  res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
            }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.ERROR});
            }
         }catch(err){
             next(err);
         }
    });
    getPackages = asyncHandler( async(req: Request, res: Response,next:NextFunction) =>{
         try{
          const filterParams : FilterParams={
            page: Number(req.query.page),
            perPage : Number(req.query.perPage),
            searchParams: {
                 search : (req.query.search as string) || '',
                 sortBy : (req.query.sortBy as string) || 'createdAt',
                 sortOrder : (req.query.sortOrder as string) || 'des',
            }
         }
            const result : TPackageResult= await this._packageService.findPackages(filterParams);
            const packages : TPackageDataDTO[] = packageMapper.userPackageData(result.packages);
            const data={
                packages:packages,
                totalCount:result.totalCount,
            }
            res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data});
         }catch(err){
            next(err);
         }
    });
    getAgentPackages = asyncHandler(async (req: Request, res: Response,next:NextFunction) =>{
      try{
         const { id } = req.params;
         const filterParams : FilterParams={
            id,
            page: Number(req.query.page),
            perPage : Number(req.query.perPage),
            searchParams: {
                 search : (req.query.search as string) || '',
                 sortBy : (req.query.sortBy as string) || 'name',
                 sortOrder : (req.query.sortOrder as string) || 'asc',
            }
         }
         const packages : TPackageResult= await this._packageService.findAgentPackages(filterParams);
         res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data:packages});
      }catch(err){
         next(err);
      }
    });
    getCategoryPackages = asyncHandler( async (req: Request, res: Response,next:NextFunction) =>{
        try{
              const packages = await this._packageService.getCategoryPackages();
              res.status(HttpStatusCode.OK).json({packages});
        }catch(err){
             next(err);
        }
    });
    advanceSearch = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
         try{
            console.log('Advance Search ::',req.query);
            const result : TPackageResult = await this._packageService.advanceSearch(req.query);
            const packages : TPackageDataDTO[] = packageMapper.userPackageData(result.packages);
            const data={
                packages:packages,
                totalPackages:result.totalCount,
            }
            res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
         }catch(err){
            next(err);
         }
    });
    verifyPackage = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
         try{
            const { packageId } = req.params;
            const { value } = req.body;
            const response = await this._packageService.verifyPackage(packageId,value);
            if(response){
               res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
            }else{
               res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.ERROR});
            }
         }catch(err){
            next(err);
         }
   });
}
