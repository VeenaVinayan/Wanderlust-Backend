//import { IUser, IAgent} from '../../Types/user.types';
import { ICategoryResponse } from '../../interface/Category.interface';
import { IBaseRepository } from '../../Interfaces/Base/IBaseRepository'
import  {ICategory } from '../../models/Category';

export interface ICategoryRepository extends IBaseRepository<ICategory>{
     isExistCategory(categoryName: string):Promise< ICategoryResponse | null>;
     deleteCategory(categoryName : string):Promise<boolean>;
     findAllCategory(perPage:number, page:number,search: string,sortBy :string,sortOrder:string):Promise<Object>;
}