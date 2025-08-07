import { BaseRepository  } from "../Base/BaseRepository";
import Booking ,{ IBooking } from '../../models/Booking';
import  { IBookingRepository } from '../../Interfaces/Booking/IBookingRepository';   
import { FilterParams } from '../../Types/Booking.types';
import mongoose from 'mongoose';
import Wallet ,{ IWallet } from "../../models/Wallet";
import { IWalletData } from '../../Types/Booking.types';
import { FilterQuery } from 'mongoose';
import Package from "../../models/Package";
import { IBookingValue , IBookingCompleteData} from '../../Types/Booking.types';
import { IBookingValidationResult } from '../../Types/Booking.types';

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
               { email: { $regex: searchParams.search, $options: 'i' } },
               {tripStatus: {$regex: searchParams.search, $options: 'i'}},
            ];
          }
            console.log("Query ::", searchParams);
            const [ data, totalCount ] = await Promise.all([ 
                  this._bookingModel.find(query)
                    .sort({ bookingDate : -1 })
                    .populate({path:'packageId', select:'name images price description day night itinerary'})
                    .skip((page - 1) * perPage)
                    .limit(perPage)
                    .exec(),
                   this._bookingModel.countDocuments(query).exec() 
            ]);
            return { data , totalCount};
    }catch(error){
            console.error('Error retrieving booking data:', error);
            throw new Error('Internal server error');
        }
    }
   
async getAgentBookingData(filterParams: FilterParams): Promise<Object> {
   try {
      console.log('getAgent Data');
      const { id, page, perPage, searchParams } = filterParams;
      const searchRegex = searchParams.search
        ? { $regex: searchParams.search, $options: 'i' }
        : undefined;
    const matchStage: Record<string, any> = {
  'packageDetails.agent': new mongoose.Types.ObjectId(id),
  };

if (searchParams.search) {
  matchStage['packageDetails.name'] = {
    $regex: searchParams.search,
    $options: 'i',
  };
}
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
  { $match: matchStage },
  {
    $group: {
      _id: '$packageDetails.name',
      packageName: { $first: '$packageDetails.name' },
      totalBooking: { $sum: 1 },
      bookings: {
        $push: {
          _id: '$_id',
          packageName: '$packageDetails.name',
          packageImage: { $arrayElemAt: ['$packageDetails.image', 0] },
          packagePrice: '$packageDetails.price',
          bookingId: '$bookingId',
          bookingDate: '$bookingDate',
          userId: '$userId',
          tripDate: '$tripDate',
          packageId: '$packageId',
          email: '$email',
          phone: '$phone',
          tripStatus: '$tripStatus',
          totalGuest: '$totalGuest',
          totalAmount: '$totalAmount', // ✅ Fixed typo
        },
      },
    },
  },
  {
    $sort: {
      [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1,
    },
  },
  {
    $facet: {
      data: [
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ],
      totalCount: [
        { $count: 'count' },
      ],
    },
  },
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
               { email: { $regex: searchParams.search, $options: 'i' } },
               {tripStatus: {$regex: searchParams.search, $options: 'i'}},
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
        {$sort: {bookingDate:-1}},
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
              return data;
          }catch(err){
            throw err;
        }
    }
 async getDashboard():Promise<Object | null>{
  try{
  const data = await this._bookingModel.aggregate([
   {
    $match: { tripStatus: "Completed" }
   },
   {
    $facet: {
      summary: [
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
            totalBooking: { $sum: 1 }
          }
        },
        {
          $set: {
            profit: { $multiply: ["$total", 0.1] }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            totalBooking: 1,
            profit: 1
          }
        }
      ],
      bookingsPerMonth: [
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            totalBookings: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ],
      topPackages: [
        {
          $group: {
            _id: "$packageId", 
            value: { $sum: 1 }
          }
        },
        {
          $sort: { value: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: "packages",
            localField: "_id",
            foreignField: "_id",
            as: "packageDetails"
          }
        },
        {
          $unwind: "$packageDetails"
        },
        {
          $project: {
            _id: 0,
            packageName: "$packageDetails.name",
            value: 1
          }
        }
      ]
    }
  }
]);
  return data.length>0 ? data[0] : null;
  }catch(err){
     throw err;
  }
}
  async getBookingCompleteData(bookingId : string):Promise<IBookingCompleteData>{
         try{
    const data = await this._bookingModel.aggregate([
     { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
     {
       $lookup: {
        from: 'packages',
        localField: 'packageId',
        foreignField: '_id',
        as: 'packageDetails'
    }
   },
  { $unwind: '$packageDetails' },
  {
    $lookup: {
      from: 'users',
      let: { agentId: '$packageDetails.agent' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$agentId'] } } }
      ],
      as: 'agentDetails'
    }
  },
  { $unwind: '$agentDetails' },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'userDetails'
    }
  },
  { $unwind: '$userDetails' },
  {
    $project: {
      _id: 0,
      bookingId: 1,
      bookingDate: 1,
      tripDate: 1,
      totalGuest: 1,
      totalAmount: 1,
      email: 1,
      phone: 1,
      'packageDetails.name': 1,
      'agentDetails.name': 1,
      'agentDetails.email': 1,
      'agentDetails.phone': 1,
      'userDetails.name': 1,
      tripStatus: 1
    }
  }
 ]);
    console.log('Booking Data ::',data[0]);
    return data[0] || {};
 }catch(err){
     throw err;
  }
 }

  async getAgentData(bookingId : string):Promise<IBookingValue | null>{
       try{
            const data = await this._bookingModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
            {
              $lookup: {
                from: 'packages',
                localField: 'packageId',
                foreignField: '_id',
                as: 'packageDetails',
              }
            },
            { $unwind: '$packageDetails' },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails',
              }
            },
            { $unwind: '$userDetails' },
            {
              $project: {
                packageName: '$packageDetails.name',
                userName: '$userDetails.name',
                agentId: '$packageDetails.agent',
              }
            }
          ]).exec();
        console.log("Data value = ", data[0]);
        return data.length>0 ? {packageName: data[0].packageName,userName:data[0].userName,agentId:data[0].agentId }: null;
       }catch(err){
          throw err;
      }
   }

async validateBooking(packageId: string, tripDate: Date): Promise<IBookingValidationResult> {
  try {
    const startDate = new Date(tripDate);
    startDate.setDate(startDate.getDate() - 5);

    const endDate = new Date(tripDate);
    endDate.setDate(endDate.getDate() + 30);
    const packageValue = await this._packageModel.findOne(
      { _id: packageId },
      { totalCapacity: 1 }
    ).lean();

    const data = await this._bookingModel.aggregate([
      {
        $match: {
          packageId: packageId,
          tripDate: { $gte: startDate, $lt: endDate },
          status: { $in: ["Pending", "Confirmed", "In-Progress"] }
        }
      },
      {
        $group: {
          _id: "$tripDate",
          bookingCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          bookingCount: 1
        }
      }
    ]);
    const targetDateString = new Date(tripDate).toDateString();
    const matchedDay = data.find(
      (d) => new Date(d.date).toDateString() === targetDateString
    );

    const resultData: IBookingValidationResult = {
      tripDate: matchedDay || { date: tripDate, bookingCount: 0 },
      totalCapacity: packageValue?.totalCapacity || 0
    };

    return resultData;
  } catch (err) {
    throw err;
  }
}

   async checkBooking(userId : string):Promise<Object>{
            const data = await this._bookingModel.aggregate([
                 { $match: { userId : userId }},
                 {
                    $lookup: {
                        from:'packages',
                        localField:'packageId',
                        foreignField:'_id',
                        as:'packageDetails'
                    }
                 },
                 {$unwind: '$packageDetails'},
                 {$group: {
                    _id:"$packageDetails.agent",
                    totalCount:{$sum:1}
                 }},
                 {
                   $project: {
                      _id:1,
                      totalCount:1
                   }
                 }
            ]);
            return data[0];
   }
 }