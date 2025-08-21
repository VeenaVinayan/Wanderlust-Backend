import { ICategoryResponse, TCategoryResult } from '../../interface/Category.interface';
import { IBaseRepository } from '../../Interfaces/Base/IBaseRepository'
import  {ICategory } from '../../models/Category';
import { FilterParams } from '../../Types/Booking.types';

export interface ICategoryRepository extends IBaseRepository<ICategory>{
     isExistCategory(categoryName: string):Promise< ICategoryResponse | null>;
     deleteCategory(categoryName : string):Promise<boolean>;
     findAllCategory(filterParams : FilterParams):Promise<TCategoryResult>;
}