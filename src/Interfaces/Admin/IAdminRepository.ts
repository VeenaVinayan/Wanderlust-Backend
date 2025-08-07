import { IPendingAgentResponse } from '../../interface/Agent';
import { FilterParams } from '../../Types/Booking.types';
import { IBaseRepository  } from '../Base/IBaseRepository';
export interface IAdminRepository{
    findAllData(user:string,perPage:number,page:number,search:string, sortBy : string, sortOrder: string):Promise<Object>;
    //findAllAgents(perPage: number, page:number):Promise<IAgent []>;   
    blockOrUnblock(id: string):Promise<boolean>;
    findPendingAgent(filterParams: FilterParams):Promise<IPendingAgentResponse>;
    agentApproval(agentId : string) : Promise<boolean>;
    rejectAgentRequest(agentId: string) : Promise<boolean>;
    findAdminId():Promise<string | null>;
}
