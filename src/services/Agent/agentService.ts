import { inject, injectable } from 'inversify';
import { IAgentRepository } from '../../Interfaces/Agent/IAgentRepository';
import {IAgentService} from '../../Interfaces/Agent/IAgentService';
import { TCategoryValue } from '../../Types/Package.types';
import { TPackage } from '../../Types/Package.types'; 

@injectable()
export class AgentService implements IAgentService{
     constructor(
        @inject("IAgentRepository") private _agentRepository : IAgentRepository,
     ){}

     async uploadCertificate(id: string, publicUrl: string): Promise<boolean>{
          try{
              console.log(' Upload certificate agent sevice !!! ');
              const result =await this._agentRepository.uploadCertificate(id,publicUrl);
              if(result.acknowledged && result.matchedCount===1 && result.modifiedCount ===1){
                 return true;
              }
              return false;
          }catch(err){
             console.log("Error in Agent service !");
             throw err;
          }
     }
   async getCategories() : Promise<TCategoryValue[]> {
        try{
            const data =  await this._agentRepository.getCategories();
            const category = data.map((category) => ({
               _id: category._id.toString(),
               name: category.name,
             }));
             return category;
        }catch(err){
           console.log('Error in fetch category in services !!');
           throw err;
        }
   }  
   async createPackage(packageData: TPackage) : Promise<boolean>{
       try{
            console.log("Data ::",packageData);
            return true;
       }catch(err){
          console.log("Error in create Package !!");
          throw err;
       }
  }
}