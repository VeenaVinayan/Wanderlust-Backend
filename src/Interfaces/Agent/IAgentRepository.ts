import { UpdateResult } from "mongoose";
import { TCategoryValue } from '../../Types/Package.types';

export interface IAgentRepository{
    uploadCertificate(id:string,certificate: string):Promise<UpdateResult>;
    getCategories():Promise<TCategoryValue[]>;
}