import { injectable } from "inversify";
import Category , { ICategory }from '../../models/Category';
import { BaseRepository } from "../Base/BaseRepository";
import { ICategoryResponse } from "../../interface/Category.interface";
import { ICategoryRepository } from '../../Interfaces/Admin/ICategoryRepository';

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
     private readonly _categoryModel = Category;
     constructor(){
         super(Category);
     }
     async isExistCategory(categoryName: string) : Promise<null| ICategoryResponse>{
         console.log("----------Inside Category Exist -------------") 
         return await this._categoryModel.findOne({name:categoryName});
     }
     async deleteCategory(categoryId : string) : Promise<boolean> {
        try{
          console.log('Delete Category !! Repository');
          const category = await this._categoryModel.findById(categoryId);
          console.log("Category ::: ",category);
          if(category){
              category.status =!category.status;
              const res = await category.save();
              if(res) return true;
              else return false; 
          }
          return false;
       }catch(err){
          console.log('Delete Category !! Repository, catch');
          throw err;
       }
     }
     async findAllCategory(perPage: number, page: number, search : string, sortBy: string, sortOrder : string) : Promise<Object> {
        try{
           console.info('Inside get Categories !!');
           const query : any= {};
           if(search){
               query.$or = [
                   { name: { $regex: search, $options:'i'}},
                   { description: {$regex: search, $options: 'i'}},
               ];
           }
           const sortOptions : any = {};
           if(sortBy){
              sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
           }
           const [ data, totalCount] = await Promise.all([ 
                 this._categoryModel
                      .find(query)
                      .sort(sortOptions)
                      .skip((page-1)*perPage)
                      .limit(perPage),
                this._categoryModel.countDocuments(),      
           ]);
           return { data,totalCount}
        }catch(err){
          throw err;
        }
     }
}