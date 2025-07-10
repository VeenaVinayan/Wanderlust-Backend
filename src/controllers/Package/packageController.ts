import { query, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode  } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { IPackageService } from '../../Interfaces/Package/IPackageService';
import asyncHandler from 'express-async-handler';
import { TPackageResult, QueryString , TAgentPackage} from '../../Types/Package.types';
import { FilterParams } from '../../Types/Booking.types';

@injectable()
export class PackageController{
    constructor(
        @inject('IPackageService') private readonly _packageService: IPackageService
    ){}
    addPackage = asyncHandler(async (req:Request, res:Response) =>{
         try{
             console.log('Add Package !!');
             const data = await this._packageService.addPackage(req.body);
             if(data){
                res.status(HttpStatusCode.CREATED).json(StatusMessage.CREATED);
             }else{
                res.status(HttpStatusCode.NOT_FOUND).jsonp(StatusMessage.ERROR);
             }
         }catch(err){
             console.log('Error in Add Package !!');
             throw err;
         }
    })
    editPackage = asyncHandler( async(req:Request, res:Response) =>{
         try{
              console.log("Edit Package");
              const { packageId } = req.params;
              const  packageData  = req.body;
              const result = await this._packageService.editPackage(packageId,packageData);
              if(result){
                 res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
              }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.NOT_FOUND});
              }
         }catch(err){
            throw err;
         }
    })
    deletePackage = asyncHandler( async(req:Request, res:Response) =>{
         try{
            const { packageId } = req.params;
            const response = await this._packageService.deletePackage(packageId);
            if(response){
                  res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
            }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({message:StatusMessage.ERROR});
            }
         }catch(err){
             throw err;
         }
    });
    getPackages = asyncHandler( async(req: Request, res: Response) =>{
         try{
          const filterParams : FilterParams={
            page: Number(req.query.page),
            perPage : Number(req.query.perPage),
            searchParams: {
                 search : (req.query.search as string) || '',
                 sortBy : (req.query.sortBy as string) || 'name',
                 sortOrder : (req.query.sortOrder as string) || 'asc',
            }
         }
            const packages : TPackageResult= await this._packageService.findPackages(filterParams);
            res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data:packages});
         }catch(err){
            throw err;
         }
    });
    getAgentPackages = asyncHandler(async (req: Request, res: Response) =>{
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
         throw err;
      }
    });
    getCategoryPackages = asyncHandler( async (req: Request, res: Response) =>{
        try{
              const packages = await this._packageService.getCategoryPackages();
              res.status(HttpStatusCode.OK).json({packages});
        }catch(err){
             throw err;
        }
    });
    advanceSearch = asyncHandler(async (req: Request, res: Response) => {
         try{
            console.log('Advance Search ::',req.query);
            const data : TPackageResult = await this._packageService.advanceSearch(req.query);
            res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS,data})
         }catch(err){
            throw err;
         }
    });
    verifyPackage = asyncHandler(async (req: Request, res: Response) => {
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
            throw err;
         }
   });
}
