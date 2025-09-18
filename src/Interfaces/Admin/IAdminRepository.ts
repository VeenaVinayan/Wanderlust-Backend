import { IPendingAgentResponse } from '../../interface/Agent';
import { FilterParams } from '../../Types/Booking.types';

export interface IAdminRepository{
    findAllData(user:string,perPage:number,page:number,search:string, sortBy : string, sortOrder: string):Promise<object>;
    blockOrUnblock(id: string):Promise<boolean>;
    findPendingAgent(filterParams: FilterParams):Promise<IPendingAgentResponse>;
    agentApproval(agentId : string) : Promise<boolean>;
    rejectAgentRequest(agentId: string) : Promise<boolean>;
    findAdminId():Promise<string | null>;
}
