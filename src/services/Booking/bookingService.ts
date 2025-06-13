import { inject , injectable } from 'inversify';
import { IBookingService } from '../../Interfaces/Booking/IBookingService';
import { IBookingRepository } from '../../Interfaces/Booking/IBookingRepository';   
import { IBookingData } from '../../Types/Booking.types';
import { IBooking } from '../../models/Booking';
import  { FilterParams, IWalletData } from '../../Types/Booking.types';
import mailSender from '../../utils/mailSender';
// import generateItineraryPDF from '../../utils/pdfGenerator';
// import fs from 'fs';
// import path from 'path';
import { IPackage } from '../../models/Package';
import EmailHelper from '../../helper/emailHelper';
import { differenceInDays } from 'date-fns';
import { INotificationRepository } from '../../Interfaces/Notification/INotificationRepository';
import { INotification } from '../../models/Notification';
import mongoose from 'mongoose';
import { emitNotification } from '../../utils/notificationEmitter';

@injectable()
export class BookingService implements IBookingService {
    constructor(
        @inject('INotificationRepository') private readonly _notificationRepository : INotificationRepository,
        @inject('IBookingRepository') private readonly _bookingRepository: IBookingRepository
    ){}
   
    async bookPackage (bookingData: IBookingData) : Promise<IBooking>{
        try {
            console.log("Inside Booking Service - bookPackage", bookingData);
            return await this._bookingRepository.createNewData(bookingData);
        }catch (error) {
            console.error('Error retrieving booking data:', error);
            throw new Error('Internal server error');
        }
    }
    async getBookingData(filterParams : FilterParams): Promise<Object> {
        try {
            console.log("Inside Booking Service - getBookingData", filterParams);
            return await this._bookingRepository.getBookingData(filterParams)
        }catch (error) {  
            console.error('Error retrieving booking data:', error);
            throw new Error('Internal server error');
        }
   }
   async sendConfirmationEmail(bookingData: IBooking): Promise<void> {
        try{ 
            console.log("Inside Booking Service - sendConformationEmail", bookingData);
            const packageData : IPackage = await this._bookingRepository.getPackageData(bookingData.packageId,bookingData._id);
            if(!packageData) {
                throw new Error("Package not found");   
            }
           //  const outputPath = path.join(__dirname, '../../', 'itinerary.pdf');
           // const itineraryPdf = generateItineraryPDF(packageData,outputPath);
            const { email,body, title } = EmailHelper.generateBookingEmailBody(bookingData);
            const result = await mailSender(email,title,body);
            console.log("Email sent successfully", result);
        }catch(err){
             console.log("Error in sending email", err);    
             throw err;
        }    
   }
   async getAgentBookingData( filterParams : FilterParams ) : Promise<Object>{
       try{
              console.log('Get Agent Booking Data !!');
              const data = await this._bookingRepository.getAgentBookingData(filterParams);
              return data;
       }catch(err){
          throw err;
       }
   }
   async updateBookingStatusByAgent(bookingId : string) : Promise<IBooking | null>{
      try{
         console.log('Update Booking Status by Agent !!');
         const data :IBooking | null= await this._bookingRepository.updateOneById(bookingId,{tripStatus:'Completed'});
         return data;
      }catch(err){
         throw err;
      }
   }
   async getBookingDataToAdmin(filterParams : FilterParams) : Promise<Object>{
      try{
          console.log('Get Booking Data !!');
          const data = await this._bookingRepository.getBookingDataToAdmin(filterParams);
          return data;
      }catch(err){
         throw err;
      }
   }
   async cancelBooking(id: string):Promise<boolean>{
     try{
         console.log('Cancel Booking in service !!',id);
         const bookingData :IBooking | null= await this._bookingRepository.findOneById(id);
         if(!bookingData){
           console.log('Not booking Data !!'); 
           return false;
         }
        if(bookingData.tripStatus !=='Cancelled'){ 
         const today = new Date();
         const bookingDate = new Date(bookingData.tripDate);
         const day = differenceInDays(bookingDate, today);
         if(day>=4){ 
              const cancellationFee = bookingData?.totalAmount *.2;
              const amount = Math.floor(bookingData.totalAmount *.8);
              const result =  await this._bookingRepository.updateOneById(id,{tripStatus:"Cancelled",paymentStatus:"Refunded"});
              const wallet = await this._bookingRepository.getWallet(bookingData.userId);
              console.log('Value in Cancel Booking ::',result,wallet,amount,cancellationFee);
              if(!wallet){
                const walletData : IWalletData= {
                  userId : bookingData.userId,
                  amount : amount,
                  transaction: {
                      amount,
                      description:'Cancellation balance payment credited' 
                  }
                }
                  const resultWallet= await this._bookingRepository.creditToWallet(walletData);
                  console.log('Values in Wallet ::',resultWallet)
                }else{
                    const updateResult = await this._bookingRepository.updateWallet(bookingData.userId,amount,'Cancellation Balance payment credited !');
                    console.log('Values in Wallet ::',updateResult)
                }
                // const notification = {
                //      userId :new mongoose.Schema.Types.ObjectId(bookingData.userId),
                //      message:`$id is cancelled by User`,
                //      type:'Booking'
                // }
               // const res = await this._notificationRepository.createNewData(notification);
                // if(res){
                //     emitNotification(bookingData.userId.toString(), {
                //     message: "Your booking has been canceled and refund is processed.",
                //     type: "booking"
                // });
              
            }else{
                return false;
            }              
            return true;  
        } else{
             return false;
        }     
    }catch(err){
         throw err;
     }
   }
   async getPackageBookingData(filterParams : FilterParams) : Promise<Object>{
       try{
            return await this._bookingRepository.getPackageBookingData(filterParams);
       }catch(err){
          throw err;
       }
   }
   async validateBooking(bookingData :IBookingData): Promise<boolean>{
    try{
        const data = await this._bookingRepository.getPackageDetails(bookingData.packageId);
        if(data){
                console.log('DAta is ...',data);
                return true;
        }else return false;
    }catch(err){
        throw err;
    }
   }
   async getDashboard():Promise<number>{
     try{
         return await this._bookingRepository.getDashboard();
     }catch(err){
        throw err;
     }
   }
}  
