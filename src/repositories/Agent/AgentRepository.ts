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
    async getDashboardData(agentId: string) {
  try {
    const objectId = new mongoose.Types.ObjectId(agentId);
    const data = await this._agentModel.aggregate([
      {
        $match: { userId: objectId },
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'userId', // Assuming 'userId' is used in packages to refer to agent
          foreignField: 'userId',
          as: 'packageDetails',
        },
      },
      {
        $unwind: {
          path: '$packageDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'bookings',
          localField: 'packageDetails._id',
          foreignField: 'packageId',
          as: 'bookings',
        },
      },
      {
        $unwind: {
          path: '$bookings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          bookingMonth: {
            $dateToString: {
              format: '%Y-%m',
              date: '$bookings.bookingDate',
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: { $cond: [{ $ifNull: ['$bookings._id', false] }, 1, 0] } },
          totalAmount: { $sum: { $ifNull: ['$bookings.totalAmount', 0] } },
          bookingsPerMonth: {
            $push: {
              month: '$bookingMonth',
            },
          },
          totalPackages: { $addToSet: '$packageDetails._id' },
          bookingCountsPerPackage: {
            $push: '$bookings.packageId',
          },
        },
      },
      {
        $addFields: {
          bookingsPerMonth: {
            $map: {
              input: { $setUnion: '$bookingsPerMonth' },
              as: 'month',
              in: {
                month: '$$month',
                count: {
                  $size: {
                    $filter: {
                      input: '$bookingsPerMonth',
                      as: 'm',
                      cond: { $eq: ['$$m', '$$month'] },
                    },
                  },
                },
              },
            },
          },
          totalPackages: { $size: '$totalPackages' },
        },
      },
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          totalAmount: 1,
          totalPackages: 1,
          bookingsPerMonth: 1,
          bookingCountsPerPackage: 1,
        },
      },
      {
        $addFields: {
          mostBookedPackage: {
            $arrayElemAt: [
              {
                $slice: [
                  {
                    $map: {
                      input: {
                        $slice: [
                          {
                            $sortArray: {
                              input: {
                                $map: {
                                  input: {
                                    $setUnion: '$bookingCountsPerPackage',
                                  },
                                  as: 'pkgId',
                                  in: {
                                    packageId: '$$pkgId',
                                    count: {
                                      $size: {
                                        $filter: {
                                          input: '$bookingCountsPerPackage',
                                          as: 'b',
                                          cond: { $eq: ['$$b', '$$pkgId'] },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              sortBy: { count: -1 },
                            },
                          },
                          1,
                        ],
                      },
                      as: 'top',
                      in: '$$top',
                    },
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
    ]).exec();

    return data[0] || {
      totalBookings: 0,
      totalAmount: 0,
      totalPackages: 0,
      bookingsPerMonth: [],
      mostBookedPackage: null,
    };
  } catch (err) {
    console.error('Dashboard Data Error:', err);
    throw new Error('Failed to fetch dashboard data');
  }
}

     

}