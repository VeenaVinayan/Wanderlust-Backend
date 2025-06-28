import { inject , injectable } from 'inversify';
import { IBookingService } from '../../Interfaces/Booking/IBookingService';
import { IBookingRepository } from '../../Interfaces/Booking/IBookingRepository';   
import { IBookingData, IDashBoardData } from '../../Types/Booking.types';
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
            const bookingValue  = await this._bookingRepository.getBookingCompleteData(bookingData._id);
            if(!bookingValue) {
                throw new Error("Package not found");   
            }
           //  const outputPath = path.join(__dirname, '../../', 'itinerary.pdf');
           // const itineraryPdf = generateItineraryPDF(packageData,outputPath);
           { 
            const { email,body, title } = EmailHelper.generateBookingEmailBody(bookingValue);
            await mailSender(email,title,body);
            console.log("Email sent successfully");
           } 
           {
            const { email, body, title } = EmailHelper.generateBookingNotificationToAgent(bookingValue);
            console.log('Email to agent ::',email);
            await mailSender(email, title,body);
            console.log("Agent Email sent successfully");
           }
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
async updateBookingStatusByAgent(bookingId: string, status: string): Promise<IBooking | null> {
  try {
    console.log('Attempting to update booking status by agent:', status);

    const bookingData: IBooking | null = await this._bookingRepository.findOneById(bookingId);

    if (!bookingData) {
      console.log(' No booking data found.');
      throw new Error('Booking not found');
    }
    
    if (bookingData.tripStatus === status) {
      throw new Error(`Booking is already marked as ${status}`);
    }

    const now = new Date();
    const tripDate = new Date(bookingData.tripDate);

    if (status === 'Completed' && tripDate > now) {
      throw new Error('Trip has not yet occurred. Cannot mark as Completed.');
    }

   if (status === 'Cancelled' && bookingData.tripStatus === 'Completed') {
      throw new Error('Completed trips cannot be cancelled.');
    }

    // Perform the status update
    const updatedBooking: IBooking | null = await this._bookingRepository.updateOneById(bookingId, {
      tripStatus: status,
      paymentStatus: status === 'Cancelled' ? 'Refunded' : bookingData.paymentStatus,
    
    });

    console.log('✅ Booking updated:', updatedBooking);
    if (updatedBooking && status === 'Cancelled') {
      const walletData: IWalletData = {
        userId: bookingData.userId,
        amount: bookingData.totalAmount,
        transaction: {
          amount: bookingData.totalAmount,
          description: 'Booking cancelled by agent — amount refunded',
        }
      };

      const refundResult = await this.addToWallet(walletData);

      if (!refundResult) {
        console.error('⚠️ Wallet refund failed');
        throw new Error('Booking was cancelled, but refund failed');
      }
        console.log(' Wallet refund successful');
       {  
        const bookingData = await this._bookingRepository.getBookingCompleteData(bookingId); 
        const { email,body, title } = EmailHelper.generateBookingEmailBody(bookingData);
        await mailSender(email,title,body);
       }  
    }
    return updatedBooking;
 } catch (error) {
    console.error('  Error updating booking status:');
    throw error;
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
   async getDashboard():Promise<IDashBoardData | null>{
     try{
         // Explicitly type the data to match the expected structure
         const data = await this._bookingRepository.getDashboard() as {
           summary: any[];
           bookingsPerMonth: Array<{
             _id: { month: number; year: number };
             totalBookings: number;
             totalRevenue: number;
           }>;
         } | null;
         if(!data) return null;
    

          const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December' ];
        data.bookingsPerMonth?.forEach(item => {
             console.log("Month:", item._id.month, "=>", MONTHS[item._id.month - 1]);
      });
         console.log('Data in Booking Service ::',JSON.stringify(data));
         const chartData = data.bookingsPerMonth?.map((item) => ({
          month: MONTHS[item._id.month - 1],
          totalBookings: item.totalBookings,
       }));
       
       const dashboardData : IDashBoardData ={
          summary: data?.summary[0],
          bookingsPerMonth: chartData && chartData.length > 0
            ? [chartData[0]]
            : [{ totalBookings: 0, month: '' }],
       } 
       console.log('Dashboard Data ::',dashboardData);
       return dashboardData;
     }catch(err){
        throw err;
     }
   }
   async addToWallet(walletData: IWalletData): Promise<boolean> {
       try {
           console.log("Adding to wallet:", walletData);
           const wallet = await this._bookingRepository.getWallet(walletData.userId);
           console.log("Wallet found ::",wallet);
           if (!wallet) {
               const result = await this._bookingRepository.creditToWallet(walletData);
               console.log("Result ::",wallet);
               return !!result
           } else {
               const result = await this._bookingRepository.updateWallet(walletData.userId, walletData.amount, walletData.transaction.description);
               console.log("Result ::-else",wallet);
               return !!result;
           }
       } catch (error) {
           console.error('Error adding to wallet:', error);
           throw new Error('Internal server error');
       }
   }
}  

async function sendConfirmationToAgent(bookingData: IBooking): Promise<void> {
    try {
        console.log("Inside Booking Service - sendConfirmationToAgent", bookingData); 
        const bookingDetails = 
        EmailHelper.generateBookingNotificationToAgent(bookingData._id);
    }catch(err){
       throw err;
    } 
  }