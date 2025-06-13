import { IPendingAgent } from '../../interface/Agent';
import { IBaseRepository  } from '../Base/IBaseRepository';
export interface IAdminRepository{
    findAllData(user:string,perPage:number,page:number,search:string, sortBy : string, sortOrder: string):Promise<Object>;
    //findAllAgents(perPage: number, page:number):Promise<IAgent []>;   
    blockOrUnblock(id: string):Promise<boolean>;
    findPendingAgent(perPage: number, page: number):Promise<IPendingAgent[]>;
    agentApproval(agentId : string) : Promise<boolean>;
    rejectAgentRequest(agentId: string) : Promise<boolean>;
}
