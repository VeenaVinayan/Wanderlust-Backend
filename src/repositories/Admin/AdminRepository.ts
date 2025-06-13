import User from '../../models/User';
import { Iuser, IAgent} from '../../Types/user.types';
import { BaseRepository } from "../Base/BaseRepository";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { IPendingAgent } from '../../interface/Agent';
import Agent from '../../models/Agent';

export class AdminRepository implements IAdminRepository {
     private readonly userModel = User;
     private readonly agentModel = Agent;
     async findAllData(user:string,perPage: number, page :number,search : string, sortBy : string, sortOrder: string) : Promise<Object>{
         try {
               const query : any= {
                  role: user,
               };
               if(search){
                  query.$or =[
                     { name: {$regex: search,$options:'i'}},
                     { email: {$regex: search, $options:'i'}},
                  ];
               }
               const sortOptions: any ={};
               if(sortBy){
                  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
               }
               const [ data , totalCount] = await Promise.all([
                    this.userModel
                             .find(query)
                             .sort(sortOptions)
                             .skip((page-1)*perPage)
                             .limit(perPage)
                             .select("_id name email phone status"),
                    this.userModel.countDocuments({role:user})
             ])
            return { data,totalCount};
         }catch(error){
             console.error("Error fetching users:",error);
             throw new Error("Error fetching users !");
        }
     }
     async blockOrUnblock (id:string): Promise<boolean> {
        try{
            console.log("Error in block/unblock User in repository !!",id);
            const user = await this.userModel.findById(id);
            console.log('After search:',user);
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
     async findPendingAgent(perPage: number, page: number): Promise<IPendingAgent[]> {
         try{
            return await this.agentModel.aggregate([
                {
                  $match: { isVerified: "Uploaded" }
                },
                {
                  $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                      { $skip: (page - 1) * perPage },
                      { $limit: perPage },
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
                        $project: {
                          _id: 1,
                          license: 1,
                          name: "$userData.name",
                          email: "$userData.email",
                          phone: "$userData.phone"
                        }
                      }
                    ]
                  }
                }
              ]);
         }catch(err){
             console.log('Error in fetch pending data in Repository !!');
             throw err;
         }
     }
     async agentApproval(agentId: string): Promise<boolean> {
          try{
              console.info('Agent approval');
              const result = await this.agentModel.updateOne({_id:agentId},{
                $set: { isVerified: "Approved"}
              })
              if(result.matchedCount === 1 && result.modifiedCount===1){
                  return true;
              }else{
                 return false;
              }
          }catch(err){
             console.log('Error in Agent Approval !!');
             throw err;
          }
     }
     async rejectAgentRequest(agentId: string): Promise<boolean> {
        try{
            console.info('Agent approval');
            const result = await this.agentModel.updateOne({_id:agentId},{
              $set: { isVerified: "Rejected"}
            })
            if(result.matchedCount === 1 && result.modifiedCount===1){
                return true;
            }else{
               return false;
            }
        }catch(err){
           console.log('Error in Agent Approval !!');
           throw err;
        }
   }
} 