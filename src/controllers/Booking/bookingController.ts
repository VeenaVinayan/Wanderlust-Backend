import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IBookingService } from '../../Interfaces/Booking/IBookingService';
import { FilterParams, IDashBoardData } from '../../Types/Booking.types'
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { IBookingValidationResult } from '../../Types/Booking.types';
import { CancellBookingResult } from '../../enums/PasswordReset';

@injectable()
export class BookingController {
     constructor(
        @inject('IBookingService') private readonly _bookingService: IBookingService
     ){}
     bookPackage = asyncHandler(async(req: Request, res: Response,next:NextFunction) => {
            try {
                const result = await this._bookingService.bookPackage(req.body);
                if(result) {
                    await this._bookingService.sendConfirmationEmail(result);
                    res.status(HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', result });
                }else {
                    res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
                }
            }catch(error){
                next(error);
            }
    });
    getBookingData = asyncHandler(async(req: Request, res: Response,next:NextFunction) => {
       try {
            const { id } = req.params;
            const { page , perPage , search, sortBy, sortOrder} = req.query;
            const filterParams : FilterParams = {
                id,
                page: Number(page),
                perPage: Number(perPage),
                searchParams: {
                     search:( search as string) || '',
                     sortBy:(sortBy as string) || 'bookingDate', 
                     sortOrder:(sortOrder as string) || 'dec',
                }
            }
            const data = await this._bookingService.getBookingData(filterParams);
            if(data) {
                res.status(HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', data });
            }else {
                res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
            }
        }catch(error){
            next(error);
        }
    });
    getAgentBookingData = asyncHandler(async(req:Request, res: Response,next:NextFunction) => {
    try{   
        const { id } = req.params;
        const filterParams : FilterParams = {
            id,
            page: Number(req.query.page),
            perPage: Number(req.query.perPage),
            searchParams: {
                 search:( req.query.search as string) || '',
                 sortBy: (req.query.sortBy as string) || 'tripDate', 
                 sortOrder:(req.query.sortOrder as string) || 'asc',
            }
        }
        const data = await this._bookingService.getAgentBookingData(filterParams);
        if(data){
             res.status(HttpStatusCode.OK).json({success:true,data});
        }else{
             res.status(HttpStatusCode.NOT_FOUND).json({success:false,data});
        }
    }catch(err){
        next(err);
    } 
    });
    updateBookingStatusByAgent = asyncHandler(async(req:Request, res:Response,next:NextFunction) =>{
        try{
            const { bookingId } = req.params;
            const { status } = req.body;
            if(!bookingId || ! status){
                res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:StatusMessage.MISSING_REQUIRED_FIELD});
                return;
            }
            const response = await this._bookingService.updateBookingStatusByAgent(bookingId,status);
            if(response){
                 res.status(HttpStatusCode.OK).json({success:true,message:'Successfully updated status'})
            }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:'Not successfully updated!'});
            }
        }catch(err){
            next(err);
        }
    });
    getBookingDataToAdmin = asyncHandler( async(req:Request, res:Response,next:NextFunction) =>{
        try{
                const filterParams : FilterParams = {
                page: Number(req.query.page),
                perPage: Number(req.query.perPage),
                searchParams: {
                     search:( req.query.search as string) || '',
                     sortBy: (req.query.sortBy as string) || 'tripDate', 
                     sortOrder:(req.query.sortOrder as string) || 'asc',
                }
            }
             const data = await this._bookingService.getBookingDataToAdmin(filterParams);
            if(data){
                  res.status(HttpStatusCode.OK).json({success:true,data});
             }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:true,data});
             }
        }catch(err){
            next(err);
        } 
    });
    cancelBooking = asyncHandler(async(req: Request, res: Response,next:NextFunction) =>{
         try{
              const { bookingId } = req.body;
              const result : CancellBookingResult = await this._bookingService.cancelBooking(String(bookingId));
              switch(result){
                 case CancellBookingResult.SUCCESS:
                     res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
                     return;
                 case CancellBookingResult.CONFLICT:
                     res.status(HttpStatusCode.CONFLICT).json({success:false,message:StatusMessage.MISSING_REQUIRED_FIELD});
                      return;
                case CancellBookingResult.EXCEEDED_CANCELLATION_LIMIT:
                     res.status(HttpStatusCode.CONFLICT).json({success:false,message:StatusMessage.EXCEEDED_CANCELLATION_LIMIT});
                     return;
                case CancellBookingResult.ALREADY_CANCELLED:
                        res.status(HttpStatusCode.CONFLICT).json({success:false,message:StatusMessage.ALREADY_CANCELLED});
                        return;
                default:
                        res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:StatusMessage.NOT_FOUND});        
              }
         }catch(err){
             next(err);
         }
    })
 getPackageBooking = asyncHandler(async ( req: Request, res: Response,next:NextFunction) => {
    try{     
     const { packageId } = req.params;
     const { page, perPage, searchParams } = req.query;
     const filterParams : FilterParams = {
        id: packageId,
        page : Number(page),
        perPage: Number(perPage),
        searchParams: { 
             search: (searchParams as string) || '',
             sortBy: 'tripDate',
             sortOrder:(req.query.sortOrder as string) || 'dec',
      }  
    }
     const data = await this._bookingService.getPackageBookingData(filterParams);
     res.status(HttpStatusCode.OK).json({success:true, data});
  }catch(err){
    next(err);
 }
});
 getDashboard = asyncHandler(async(req: Request, res: Response,next:NextFunction) => {
     try{
          const data : IDashBoardData | null = await this._bookingService.getDashboard();
          if(data){
             res.status(HttpStatusCode.OK).json({data});
          }else{
             res.status(HttpStatusCode.NOT_FOUND).json({data});     
          } 
     }catch(err){
        next(err);
     }
 } );
 validateBooking = asyncHandler(async(req:Request,res:Response,next:NextFunction) =>{
     try{
            const { packageId, day} = req.query;
            if(!packageId || !day){
                 res.status(HttpStatusCode.BAD_REQUEST).json({success:false});
                 return;
            }
            const data : IBookingValidationResult | null = await this._bookingService.validateBooking(
                String(packageId),
                new Date(String(day))
            );
            res.status(HttpStatusCode.OK).json({success:true,data});
      }catch(err){
         next(err);
     }
 })
}

