import { TCategoryValue } from "../../Types/Package.types"; 
import { IBooking } from '../../models/Booking';

export interface IAgentService{
    uploadCertificate(id:string, publicUrl:string): Promise<boolean>;
    getCategories():Promise<TCategoryValue[]>;
    getDashboardData(agentId : string):Promise<Object>;
}