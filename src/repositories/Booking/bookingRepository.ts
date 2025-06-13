import { BaseRepository  } from "../Base/BaseRepository";
import Booking ,{ IBooking } from '../../models/Booking';
import  { IBookingRepository } from '../../Interfaces/Booking/IBookingRepository';   
import { FilterParams } from '../../Types/Booking.types';
import mongoose from 'mongoose';
import Wallet ,{ IWallet } from "../../models/Wallet";
import { IWalletData } from '../../Types/Booking.types';
import { FilterQuery } from 'mongoose';
import Package from "../../models/Package";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository{
    private readonly _bookingModel = Booking;
    private readonly _walletModel = Wallet;
    private readonly _packageModel = Package;
    constructor(){
        super(Booking);
    }
    async getBookingData(filterParams: FilterParams): Promise<Object> {
        try {
            const { id, page, perPage, searchParams } = filterParams;
            const query : FilterQuery<IBooking>= {userId: id };
            if(searchParams.search){
              query.$or = [
               { bookingId: { $regex: searchParams.search, $options: 'i' } },
               { email: { $regex: searchParams.search, $options: 'i' } }
            ];
          }
            console.log("Query ::", searchParams);
            const [ data, totalCount ] = await Promise.all([ 
                  this._bookingModel.find(query)
                    .populate({path:'packageId', select:'name images price description day night itinerary'})
                    .skip((page - 1) * perPage)
                    .limit(perPage)
                    .sort({ [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1 })
                    .exec(),
                   this._bookingModel.countDocuments(query).exec() 
            ]);
            return { data , totalCount};
    }catch(error){
            console.error('Error retrieving booking data:', error);
            throw new Error('Internal server error');
        }
    }
    async getPackageData(packageId: string,bookingId : string): Promise<any> { 
        try {
            const packageData = await this._bookingModel.findById(bookingId).populate('packageId').exec();
            if (!packageData) {
                throw new Error('Package not found');
            }
            console.log("Package Data ::", packageData);
            const packageDetails = packageData.packageId;
            return packageData;
        } catch (error) {
            console.error('Error retrieving package data:', error);
            throw new Error('Internal server error');
        }
    }
    async getAgentBookingData(filterParams: FilterParams): Promise<Object> {
        try {
            console.log('getAgent Data');
            const { id, page, perPage, searchParams } = filterParams;
            const data = await this._bookingModel.aggregate([
                {
                    $lookup: {
                        from: 'packages',
                        localField: 'packageId',
                        foreignField: '_id',
                        as: 'packageDetails',
                    },
                },
                { $unwind: '$packageDetails' },
                {
                     $match: {
                         'packageDetails.agent': new mongoose.Types.ObjectId(id),
                     },
                },
                {
                    $group: {
                        _id:'$packageDetails.name',
                        packageName: {$first:'$packageDetails.name'},
                        totalBooking:{$sum: 1},
                        bookings:{
                            $push:{
                                _id:'$_id',
                                packageName:'$packageDetails.name',
                                packageImage:'$packageDetails.image[0]',
                                packagePrice:'$packageDetails.price',
                                bookingId:'$bookingId',
                                bookingDate:'$bookingDate',
                                userId:'$userId',
                                tripDate:'$tripDate',
                                packageId:'$packageId',
                                email:'$email',
                                phone:'$phone',
                                tripStatus:'$tripStatus',
                                totalGuest:'$totalGuest',
                                totalAmount:'$totalAmout',
                            },
                        }
                    }
                 },
                 {
                     $facet: {
                         data: [
                             {
                                 $sort: {
                                     [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1,
                                 },
                             },
                             { $skip: (page - 1) * perPage },
                             { $limit: perPage },
                         ],
                         totalCount: [
                             { $count: 'count' }
                         ]
                     }
                 }
            ]);
            const resultData = data[0].data;
            const totalCount = data[0].totalCount[0]?.count || 0;
            return { data:resultData, totalCount}
        }catch(err){
             throw err;
        }  
    }
   async getBookingDataToAdmin(filterParams: FilterParams): Promise<Object> {
    try {
        const { page, perPage, searchParams } = filterParams;
        const skip =  (page - 1) * perPage;
        console.log(' DAta value is ::',page,perPage,skip,)
        const query : FilterQuery<IBooking> = {};
         if(searchParams.search){
              query.$or = [
               { bookingId: { $regex: searchParams.search, $options: 'i' } },
               { email: { $regex: searchParams.search, $options: 'i' } }
            ];
        }
 const result = await this._bookingModel.aggregate([
   {
    $lookup: {
      from: 'packages',
      localField: 'packageId',
      foreignField: '_id',
      as: 'packages',
    },
  },
  { $unwind: '$packages' },
  {$match: query},
  {
    $facet: {
      metadata: [
        { $count: 'total' },
        { $addFields: { page, perPage } },
      ],
      data: [
        { $skip: skip },
        { $limit: perPage },
      ],
    },
  },
]);
      const data = result[0].data;
      const totalCount = result[0].metadata[0]?.total || 0;
      console.log("REsult :::",data,totalCount);
      return { data, totalCount };
  } catch (error) {
       console.error('Error retrieving booking data:', error);
       throw new Error('Internal server error');
  }
}
   async creditToWallet( walletData : IWalletData) : Promise<IWallet>{
         try{
              console.log('Credit to Wallet !!');  
              const wallet = new Wallet(walletData);
              const result = await wallet.save(); 
              return result;
         }catch(err){
             throw err;
         }
    }
   async getWallet(userId : string):Promise<IWallet | null>{
         try{
             console.log('Get Wallet Data !!',userId);
             const wallet : IWallet | null= await this._walletModel.findOne({userId});
             return wallet;  
      }catch(err){
          throw err;
      }
   }
  async updateWallet(userId : string, amount:number,description: string): Promise<Object>{
         try{
             console.log('Update Wallet !!');
             const updated = await this._walletModel.updateOne(
                { userId },
                {
                    $inc: { amount: amount },
                    $push: {
                        transaction: {
                            amount,
                             description
                        }
                    }
                },
                {new : true},
            );
            return updated;
         }catch(err){
             throw err;
         }
    }
   
    async getPackageBookingData(filterParams : FilterParams) : Promise<Object>{
         try{
               const { id, page, perPage, searchParams } = filterParams;
               const query : FilterQuery<IBooking>= { packageId : id};
               if(searchParams.search){
               query.$or = [
                  { bookingId: { $regex: searchParams.search, $options: 'i' } },
                  { email: { $regex: searchParams.search, $options: 'i' } },
                  { tripStatus: {$regex: searchParams.search, $options: 'i'}},
                 ];
               }  
               const [ data ,totalCount] = await Promise.all([ 
                  this._bookingModel.find(query)
                    .populate({path:'userId', select:'name'})
                    .populate({path:'packageId', select:'name images price'})
                    .skip((page - 1) * perPage)
                    .limit(perPage)
                    .sort({ [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1 })
                    .exec(),
                   this._bookingModel.countDocuments(query).exec()
               ])
             return { data, totalCount};    
         }catch(err){
            throw err;
         }
    }
    async getPackageDetails(packageId : string): Promise<Object | null>{
        try{
                const data = await this._packageModel.findOne({_id:packageId});
                 console.log('DAta ==',data);
                return data;
          }catch(err){
            throw err;
        }
    }
    async getDashboard():Promise<number>{
        try{
                const data = await this._bookingModel.aggregate([
                        { $match : {tripStatus: 'Completed'}},
                        { $group : {_id: null , total :{$sum: '$totalAmount'}} },
                        { $set: { profit: { $multiply: [ "$total", .1 ] }  } },
                        {$project: {_id:0,profit:1}}
                ]);
                console.log('DAta = ',data);
                const profit = data.length>0 ? data[0]?.profit : 0;
                return profit;
        }catch(err){
            throw err;
        }
    }
}