import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { IAdminService } from '../../Interfaces/Admin/IAdminService';
import { ICategoryRepository } from "../../Interfaces/Admin/ICategoryRepository";
import { ICategory } from "../../interface/Interface";
import { IPendingAgentResponse } from '../../interface/Agent';
import { IAdminPackageRepository } from "../../Interfaces/Package/IAdminPackageRepository";
import { FilterParams } from '../../Types/Booking.types';
import { TCategoryResult } from "../../interface/Category.interface";

injectable()
export class AdminService implements IAdminService{
    constructor(
        @inject("IAdminRepository") private _adminRepository: IAdminRepository,
        @inject("ICategoryRepository") private _categoryRepository: ICategoryRepository,
        @inject("IAdminPackageRepository") private _adminPackageRepository: IAdminPackageRepository,
    ){}

  async getAllData(user:string, perPage:number,page:number,search:string,sortBy:string,sortOrder: string):Promise<object>{ 
      try{
        return await this._adminRepository.findAllData(user,perPage,page,search,sortBy,sortOrder);
      }catch(error){
        throw new Error("Failed to retrieve users ");
      }
  }
  async blockOrUnblock(id:string):Promise<boolean>{
     try{
        return await this._adminRepository.blockOrUnblock(id)
     }catch(err){
       throw new Error("Failed to Block/ Unblock !");
     }
  }
  async addCategory(data : ICategory) :Promise<boolean>{
    try{
        data.name = data.name.toUpperCase();
        await this._categoryRepository.createNewData(data);
        return true;
    }catch(err){
        console.log('Error in create Category |',err);
        throw err;
    }
  }
  async getCategories(filterParams : FilterParams): Promise<TCategoryResult>{
    try{
        return await this._categoryRepository.findAllCategory(filterParams);
    }catch(err){
        throw err;
    }
  }
  async deleteCategory(categoryId : string) : Promise<boolean> {
      try{
          const res = await this._categoryRepository.deleteCategory(categoryId);
          if(res) return true;
          else return false;
      }catch(err){
          throw err;
      }
  }
  async isExistCategory(categoryName: string) : Promise<boolean> {
      try{
           const res = await this._categoryRepository.isExistCategory(categoryName.toUpperCase()); 
            if(res) return true;
            else return false;
      }catch(err){
           throw err;
      }
  }
  async editCategory(categoryId: string,category: ICategory) : Promise<boolean>{
      try{
        const res= await this._categoryRepository.updateOneById(categoryId,category);
        if(res) return true;
        else return false;
      }catch(err){
         throw err;
      }
  }
  async getPendingAgentData(params : FilterParams) : Promise<IPendingAgentResponse> {
     try{
         const data = await this._adminRepository.findPendingAgent(params);
         return data;
     }catch(err){
        throw err;
     }
  }
  async agentApproval(agentId: string): Promise<boolean> {
     try{
         return await this._adminRepository.agentApproval(agentId);
     }catch(err){
         throw err;
     }
  }
  async rejectAgentRequest(agentId: string): Promise<boolean> {
    try{
        return await this._adminRepository.agentApproval(agentId);
    }catch(err){
        throw err;
    }
 }
 async blockPackage(packageId: string) : Promise<boolean> {
     try{
            const result = await this._adminPackageRepository.blockPackage(packageId);
            if(result) return true;
            else return false;
     }catch(err){
        throw err;
     }
 }
}