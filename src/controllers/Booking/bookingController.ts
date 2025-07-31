import { Request, Response } from 'express';
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
     bookPackage = asyncHandler(async(req: Request, res: Response) => {
            try {
                //const resultValue = await this._bookingService.validateBooking(req.body);
                console.log("Booking Data ::",req.body);
                const result = await this._bookingService.bookPackage(req.body);
                if(result) {
                    await this._bookingService.sendConfirmationEmail(result);
                    res.status(HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', result });
                }else {
                    res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
                }
            }catch(error){
                console.error('Error retrieving booking data:', error);
                throw error;
            }
    });
    getBookingData = asyncHandler(async(req: Request, res: Response) => {
       try {
            console.log("Get Booking Data ",req.query);
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
            console.log("Booking Data ::",data);
            if(data) {
                res.status(HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', data });
            }else {
                res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
            }
        }catch(error){
            console.error('Error retrieving booking data:', error);
            throw error;
        }
    });
    getAgentBookingData = asyncHandler(async(req:Request, res: Response) => {
      try{   
        console.log('Get Agent  Booking Data !');
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
        throw err;
    } 
    });
    updateBookingStatusByAgent = asyncHandler(async(req:Request, res:Response) =>{
        try{
            console.log('Update Booking Status by Agent !!');
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
            throw err;
        }
    });
    getBookingDataToAdmin = asyncHandler( async(req:Request, res:Response) =>{
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
             console.log("Booking Data is ::",data);
             if(data){
                  res.status(HttpStatusCode.OK).json({success:true,data});
             }else{
                 res.status(HttpStatusCode.NOT_FOUND).json({success:true,data});
             }
        }catch(err){
            throw err;
        } 
    });
    cancelBooking = asyncHandler(async(req: Request, res: Response) =>{
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
            //   if(CancellBookingResult.SUCCESS){
            //      res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
            //   }else{
            //      res.status(HttpStatusCode.CONFLICT).json({success:false,message:StatusMessage.CANCEL_BOOKING});
            //   }
         }catch(err){
             throw err;
         }
    })
 getPackageBooking = asyncHandler(async ( req: Request, res: Response) => {
    try{     
     const { packageId } = req.params;
     const { page, perPage, searchParams } = req.query;
     console.log('Get packages : ,packagId, searchParams', packageId, searchParams);
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
     console.log("Package Data is :: ",data);
     res.status(HttpStatusCode.OK).json({success:true, data});
  }catch(err){
    throw err;
 }
});
 getDashboard = asyncHandler(async(req: Request, res: Response) => {
     try{
          const data : IDashBoardData | null = await this._bookingService.getDashboard();
          if(data){
             res.status(HttpStatusCode.OK).json({data});
          }else{
             res.status(HttpStatusCode.NOT_FOUND).json({data});     
          } 
     }catch(err){
        throw err;
     }
 } );
 validateBooking = asyncHandler(async(req:Request,res:Response) =>{
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
            console.log("Validation Data ::",JSON.stringify(data?.tripDate));
            res.status(HttpStatusCode.OK).json({success:true,data});
            console.log('Validate Booking ',req.body);
     }catch(err){
         throw err;
     }
 })
}

