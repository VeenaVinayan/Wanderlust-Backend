import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IBookingService } from '../../Interfaces/Booking/IBookingService';
import { FilterParams } from '../../Types/Booking.types'
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { FilterRuleName } from '@aws-sdk/client-s3';

@injectable()
export class BookingController {
     constructor(
        @inject('IBookingService') private readonly _bookingService: IBookingService
     ){}
     bookPackage = asyncHandler(async(req: Request, res: Response) => {
            try {
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
                     sortBy:(sortBy as string) || 'tripDate', 
                     sortOrder:(sortOrder as string) || 'asc',
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
            const response = await this._bookingService.updateBookingStatusByAgent(bookingId);
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
              const result = await this._bookingService.cancelBooking(String(bookingId));
              if(result){
                 res.status(HttpStatusCode.OK).json({success:true,message:StatusMessage.SUCCESS});
              }else{
                 res.status(HttpStatusCode.CONFLICT).json({success:false,message:StatusMessage.CANCEL_BOOKING});
              }
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
             sortOrder:(req.query.sortOrder as string) || 'asc',
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
          const profit = await this._bookingService.getDashboard();
          if(profit){
             res.status(HttpStatusCode.OK).json({data:profit});
          }
     }catch(err){
        throw err;
     }
 } );

}

