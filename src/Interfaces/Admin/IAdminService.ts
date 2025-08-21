import { TCategoryResult } from "../../interface/Category.interface";
import {ICategory } from '../../interface/Interface';
import { IPendingAgentResponse} from '../../interface/Agent';
import { FilterParams } from '../../Types/Booking.types';

 export interface IAdminService{
    getAllData(user :string,perPage:number,page:number,search: string,sortBy: string, sortOrder: string ):Promise<Object>;
    blockOrUnblock(id:string):Promise<boolean>;
    addCategory(data: ICategory):Promise<boolean>;
    getCategories(filterParams : FilterParams): Promise<TCategoryResult>;
    deleteCategory(categoryId : string) : Promise<boolean>;
    isExistCategory(categoryName: string) : Promise<boolean>;
    editCategory(categoryId:string, category: ICategory) : Promise<boolean>
    getPendingAgentData(filterParams : FilterParams):Promise<IPendingAgentResponse>
    agentApproval(agentId: string) : Promise<boolean>
    rejectAgentRequest(agentId: string) : Promise<boolean>;
    blockPackage(packageId: string) : Promise<boolean>;
}