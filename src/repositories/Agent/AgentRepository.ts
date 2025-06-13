import { IAgentRepository } from '../../Interfaces/Agent/IAgentRepository';
import Agent, { IAgent } from '../../models/Agent';
import { BaseRepository } from '../Base/BaseRepository';
import { UpdateResult } from 'mongoose';
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
}