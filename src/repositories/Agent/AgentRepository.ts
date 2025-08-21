import { IAgentRepository } from '../../Interfaces/Agent/IAgentRepository';
import Agent, { IAgent } from '../../models/Agent';
import { BaseRepository } from '../Base/BaseRepository';
import mongoose,{ UpdateResult } from 'mongoose';
import Category from '../../models/Category';
import { TCategoryValue } from '../../Types/Package.types';

export class AgentRepository extends BaseRepository <IAgent> implements IAgentRepository {
    private readonly _agentModel = Agent;
    private readonly _categoryModel = Category;
    constructor(){
        super(Agent);
    }
    async uploadCertificate( id: string, certificate: string): Promise<UpdateResult> {
        try{
            console.log(" Agent reposiory for upload certificate !!");
            return await Agent.updateOne({userId:id},{
                    $set: {license: certificate, isVerified:'Uploaded'}
            })
        }catch(err){
             console.log("Error in upload photo !");
             throw err;
        }
    }
    async getCategories() : Promise<TCategoryValue[]> {
         try{
              return await this._categoryModel.find({status:true},{_id:1,name:1});
         }catch(err){
            console.log(' Error in Fetch Category !!');
            throw err;
         }
    }
  async getDashboardData(agentId: string): Promise<Object> {
  try {
    const data = await this._agentModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(agentId) },
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'userId',
          foreignField: 'agent',
          as: 'packages',
        },
      },
      { $unwind: { path: '$packages', preserveNullAndEmptyArrays: false } },

      {
        $lookup: {
          from: 'bookings',
          let: { packageId: '$packages._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$packageId', '$$packageId'] },
                    { $eq: ['$tripStatus', 'Completed'] },
                  ],
                },
              },
            },
          ],
          as: 'completedBookings',
        },
      },
     {
        $lookup: {
          from: 'bookings',
          let: { packageId: '$packages._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$packageId', '$$packageId'] },
                    { $eq: ['$tripStatus', 'Cancelled'] },
                  ],
                },
              },
            },
          ],
          as: 'cancelledBookings',
        },
      },

      {
        $facet: {
          totalPackages: [
            {
              $group: {
                _id: null,
                packageIds: { $addToSet: '$packages._id' },
              },
            },
            {
              $project: {
                totalPackages: { $size: '$packageIds' },
              },
            },
          ],

          totalClients: [
            { $unwind: '$completedBookings' },
            {
              $group: {
                _id: null,
                clients: { $addToSet: '$completedBookings.userId' },
              },
            },
            {
              $project: {
                totalClients: { $size: '$clients' },
              },
            },
          ],

          totalBookingStats: [
            { $unwind: '$completedBookings' },
            {
              $group: {
                _id: null,
                totalCompletedBookings: { $sum: 1 },
                totalAmount: { $sum: '$completedBookings.totalAmount' },
              },
            },
          ],

          cancelledBookingStats: [
            { $unwind: '$cancelledBookings' },
            {
              $group: {
                _id: null,
                totalCancelledBookings: { $sum: 1 },
              },
            },
          ],

          bookingsPerMonth: [
            { $unwind: '$completedBookings' },
            {
              $group: {
                _id: { month: { $month: '$completedBookings.bookingDate' } },
                totalBookings: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                month: '$_id.month',
                totalBookings: 1,
              },
            },
            { $sort: { month: 1 } },
          ],

          packageBookingCounts: [
            { $unwind: '$completedBookings' },
            {
              $group: {
                _id: '$packages._id',
                packageName: { $first: '$packages.name' },
                value: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                packageName: 1,
                value: 1,
              },
            },
          ],
        },
      },

      {
        $project: {
          totalPackages: { $arrayElemAt: ['$totalPackages.totalPackages', 0] },
          totalClients: { $arrayElemAt: ['$totalClients.totalClients', 0] },
          totalBookings: { $arrayElemAt: ['$totalBookingStats.totalCompletedBookings', 0] },
          totalAmount: { $arrayElemAt: ['$totalBookingStats.totalAmount', 0] },
          totalCancelledBookings: {
            $ifNull: [
              { $arrayElemAt: ['$cancelledBookingStats.totalCancelledBookings', 0] },
              0,
            ],
          },
          bookingsPerMonth: 1,
          packageBookingCounts: 1,
        },
      },
    ]);

    console.log('Dashboard Data ::', data[0]);

    return (
      data[0] || {
        totalBookings: 0,
        totalAmount: 0,
        totalPackages: 0,
        totalClients: 0,
        totalCancelledBookings: 0,
        bookingsPerMonth: [],
        packageBookingCounts: [],
      }
    );
  } catch (err) {
    console.error('Dashboard Data Error:', err);
    throw new Error('Failed to fetch dashboard data');
  }
}


}