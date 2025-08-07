import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { IAdminService } from '../../Interfaces/Admin/IAdminService';
import {Iuser, IAgent} from '../../Types/user.types';
import { ICategoryRepository } from "../../Interfaces/Admin/ICategoryRepository";
import { ICategory } from "../../interface/Interface";
import { IPendingAgentResponse } from '../../interface/Agent';
import { IAdminPackageRepository } from "../../Interfaces/Package/IAdminPackageRepository";
import { FilterParams } from '../../Types/Booking.types';

injectable()
export class AdminService implements IAdminService{
    constructor(
        @inject("IAdminRepository") private _adminRepository: IAdminRepository,
        @inject("ICategoryRepository") private _categoryRepository: ICategoryRepository,
        @inject("IAdminPackageRepository") private _adminPackageRepository: IAdminPackageRepository,
    ){}

  async getAllData(user:string, perPage:number,page:number,search:string,sortBy:string,sortOrder: string):Promise<object>{ 
      try{
         console.log("Inside Service - getAllUser");
         return await this._adminRepository.findAllData(user,perPage,page,search,sortBy,sortOrder);
      }catch(error){
        console.log(error);
        throw new Error("Failed to retrieve users ");
      }
  }
  async blockOrUnblock(id:string):Promise<boolean>{
     try{
         console.info('Block / Unblock User in service!');
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
  async getCategories(filterParams : FilterParams): Promise<object>{
    try{
        console.log('Get Categories !');
        return await this._categoryRepository.findAllCategory(filterParams);
    }catch(err){
        console.log('Error in service get Categories !!');
        throw err;
    }
  }
  async deleteCategory(categoryId : string) : Promise<boolean> {
      try{
          console.log(' Delete Category , service!!');
          const res = await this._categoryRepository.deleteCategory(categoryId);
          if(res) return true;
          else return false;
      }catch(err){
          console.log('Error in Delete Category , service!! catch',err);
          throw err;
      }
  }
  async isExistCategory(categoryName: string) : Promise<boolean> {
      try{
            console.log('In Admin Service !!');
            const res = await this._categoryRepository.isExistCategory(categoryName.toUpperCase()); 
            if(res) return true;
            else return false;
      }catch(err){
        console.error('Error in service',err);
        throw err;
      }
  }
  async editCategory(categoryId: string,category: ICategory) : Promise<boolean>{
      try{
        console.log('Admin service -- Edit category !');
        const res= await this._categoryRepository.updateOneById(categoryId,category);
        if(res) return true;
        else return false;
      }catch(err){
         console.error("Error in Edit Category SErvice ::",err);
         throw err;
      }
  }
  async getPendingAgentData(params : FilterParams) : Promise<IPendingAgentResponse> {
     try{
         const data = await this._adminRepository.findPendingAgent(params);
         return data;
     }catch(err){
      console.error("Error in get Pending Agent Service ::",err);
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
            console.log('Admin block a package !!');
            const result = await this._adminPackageRepository.blockPackage(packageId);
            if(result) return true;
            else return false;
     }catch(err){
        throw err;
     }
 }
}