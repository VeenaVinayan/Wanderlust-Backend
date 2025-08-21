import User,{IUser} from '../../models/User';
import { Iuser, IAgent} from '../../Types/user.types';
import { BaseRepository } from "../Base/BaseRepository";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { IPendingAgentResponse } from '../../interface/Agent';
import Agent from '../../models/Agent';
import { FilterQuery } from 'mongoose';
import { FilterParams } from '../../Types/Booking.types';

export class AdminRepository implements IAdminRepository {
     private readonly _userModel = User;
     private readonly _agentModel = Agent;
     async findAllData(user:string,perPage: number, page :number,search : string, sortBy : string, sortOrder: string) : Promise<Object>{
         try {
               const query : FilterQuery<IUser>= { role: user };
               if(search){
                  query.$or =[
                     { name: {$regex: search,$options:'i'}},
                     { email: {$regex: search, $options:'i'}},
                  ];
               }
               const sortOptions: Record<string, 1|-1> ={};
               if(sortBy){
                  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
               }
               const [ data , totalCount] = await Promise.all([
                    this._userModel
                             .find(query)
                             .sort(sortOptions)
                             .skip((page-1)*perPage)
                             .limit(perPage)
                             .select("_id name email phone status"),
                    this._userModel.countDocuments(query).exec()
             ]);
            return { data,totalCount};
         }catch(error){
            throw new Error("Error fetching users !");
        }
     }
     async blockOrUnblock (id:string): Promise<boolean> {
        try{
            const user = await this._userModel.findById(id);
            if(user){
                user.status = !user.status
                const res =await user.save();
                if(res) return true;
                else return false;
            }
            return false;
        }catch{
             console.log("Error in block/unblock User !!");
             throw new Error("Error in Block/UnBlock")
        }
     }
     async findPendingAgent(params:FilterParams): Promise<IPendingAgentResponse> {
         try{
            const { page, perPage, searchParams} = params;
            const query :FilterQuery<IUser> = {};
            if(searchParams.search){
               query.$or =[
                  { 'userData.name': {$regex: searchParams.search, $options:'i'}},
                  {'userData.email':{$regex:searchParams.search,$options:'i'}},
               ]
            }
            const data =  await this._agentModel.aggregate([
            {
               $match: { isVerified: "Uploaded" }
            },
            {
               $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userData"
               }
            },
            { $unwind: "$userData" },

            {
               $match: {  $or: [
                  { 'userData.name': { $regex: searchParams.search, $options: 'i' } },
                  { 'userData.email': { $regex: searchParams.search, $options: 'i' } },
                  {'userData.phone':{$regex: searchParams.search, $options:'i'}},
             ]}
            },
            { 
                $facet: {
                  metadata: [{ $count: "total" }],
                  data: [
                  { $skip: (page - 1) * perPage },
                  { $limit: perPage },
                  {
                     $project: {
                        _id: 1,
                        license: 1,
                        address: 1, 
                        name: "$userData.name",
                        email: "$userData.email",
                        phone: "$userData.phone"
                     }
                  }
                  ]
               }
            }
            ]);
               const pendingAgent : IPendingAgentResponse = {
                   data : data[0]?.data || [],
                   totalCount:data[0]?.metadata[0]?.total || 0,
               }
               return pendingAgent;
         }catch(err){
            throw err;
         }
     }
     async agentApproval(agentId: string): Promise<boolean> {
          try{
            const result = await this._agentModel.updateOne({_id:agentId},{
                $set: { isVerified: "Approved"}
              })
              if(result.matchedCount === 1 && result.modifiedCount===1){
                  return true;
              }else{
                 return false;
              }
          }catch(err){
            throw err;
          }
     }
     async rejectAgentRequest(agentId: string): Promise<boolean> {
        try{
            const result = await this._agentModel.updateOne({_id:agentId},{
              $set: { isVerified: "Rejected"}
            })
            if(result.matchedCount === 1 && result.modifiedCount===1){
                return true;
            }else{
               return false;
            }
        }catch(err){
           throw err;
        }
   }
   async findAdminId(): Promise<string | null> {
      try{
           const adminId : string | null= await this._userModel.findOne({role:'Admin'},{_id:1});
           return adminId;
      }catch(err){
          throw err;
      }
   }
} 