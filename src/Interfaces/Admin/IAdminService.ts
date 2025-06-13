//import { IUser, IAgent} from '../../Types/user.types';
import { ICategoryResponse } from "../../interface/Category.interface";
import {ICategory } from '../../interface/Interface';
import { IPendingAgent} from '../../interface/Agent';

export interface IAdminService{
    getAllData(user :string,perPage:number,page:number,search: string,sortBy: string, sortOrder: string ):Promise<Object>;
    blockOrUnblock(id:string):Promise<boolean>;
    addCategory(data: ICategory):Promise<boolean>;
    getCategories(perPage: number, page: number, search: string, sortBy: string, sortOrder: string): Promise<Object>;
    deleteCategory(categoryId : string) : Promise<boolean>;
    isExistCategory(categoryName: string) : Promise<boolean>;
    editCategory(categoryId:string, category: ICategory) : Promise<boolean>
    getPendingAgentData(perPage: number, page: number):Promise<IPendingAgent[]>
    agentApproval(agentId: string) : Promise<boolean>
    rejectAgentRequest(agentId: string) : Promise<boolean>;
    blockPackage(packageId: string) : Promise<boolean>;
}