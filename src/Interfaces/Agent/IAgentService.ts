import { TCategoryValue } from "../../Types/Package.types"; 

export interface IAgentService{
    uploadCertificate(id:string, publicUrl:string): Promise<boolean>;
    getCategories():Promise<TCategoryValue[]>;
    getDashboardData(agentId : string):Promise<object>;
}