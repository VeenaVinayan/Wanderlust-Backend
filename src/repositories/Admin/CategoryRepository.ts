import { injectable } from "inversify";
import Category , { ICategory }from '../../models/Category';
import { BaseRepository } from "../Base/BaseRepository";
import { ICategoryResponse } from "../../interface/Category.interface";
import { ICategoryRepository } from '../../Interfaces/Admin/ICategoryRepository';
import { FilterQuery } from 'mongoose';
import { FilterParams } from '../../Types/Booking.types';

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
     private readonly _categoryModel = Category;
     constructor(){
         super(Category);
     }
     async isExistCategory(categoryName: string) : Promise<null| ICategoryResponse>{
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
     async findAllCategory(filterParams : FilterParams) : Promise<Object> {
        try{
           console.info('Inside get Categories !!');
           const query : FilterQuery<ICategory> ={};
           const { page, perPage, searchParams} = filterParams;
           if(searchParams.search){
               query.$or = [
                   { name: { $regex: searchParams.search, $options:'i'}},
                   { description: {$regex: searchParams.search, $options: 'i'}},
                   {status:true},
               ];
           }
           const sortOptions : Record<string, 1|-1> = {};
           if(searchParams.sortBy){
              sortOptions[searchParams.sortBy] = searchParams.sortOrder === 'asc' ? 1 : -1;
           }
           const [ data, totalCount] = await Promise.all([ 
                 this._categoryModel
                      .find(query)
                      .sort(sortOptions)
                      .skip((page-1)*perPage),
                 this._categoryModel.countDocuments(query),      
           ]);
           return { data,totalCount}
        }catch(err){
          throw err;
        }
     }
}