import { inject, injectable } from "inversify";
import { IPackageRepository } from "../../Interfaces/Package/IPackageRepository";
import { IPackageService } from "../../Interfaces/Package/IPackageService";
import { TPackage, TPackageResult, TPackageUpdate, QueryString } from '../../Types/Package.types';
import { FilterParams } from '../../Types/Booking.types';

injectable()
export class PackageService implements IPackageService{
     constructor(
         @inject("IPackageRepository") private _packageRepository: IPackageRepository
     ){}
    async addPackage(packageData: TPackage ):Promise<boolean>{
         try{
           const data = await this._packageRepository.createNewData(packageData);
           if(data) return true;
           else return false;
         }catch(err){
             console.log('Error in Package Service !!');
             throw err;
         }
    } 
    async editPackage(packageId: string,packageData : TPackage) : Promise<boolean>{
      try{
            console.log("Package edit in service !");
            const { ...updatedPackage }: TPackageUpdate = packageData;
            console.log("Updated package ::", updatedPackage,"Package Data ::",packageData);
            const result =  await this._packageRepository.editPackage(packageId,updatedPackage);
            if(result) return true;
            else return false;
      }catch(err){
         throw err;
      }
    }
    async deletePackage(packageId : string): Promise<boolean>{
        try{
            console.log('Package Delete in Service !');
            if(packageId){
               const response = await this._packageRepository.deletePackage(packageId);
               if(response) return true;
               else return false;
            }else return false;
        }catch(err){
           throw err;
        }
    }
    async findPackages(searchParams : FilterParams):Promise<TPackageResult>{
         try{
              const response : TPackageResult = await this._packageRepository.findPackages(searchParams);
              return response;
         }catch(err){
             throw err;
         }
    }
    async findAgentPackages(searchParams : FilterParams):Promise<TPackageResult>{
         try{
              const response : TPackageResult = await this._packageRepository.findAgentPackages(searchParams);
              return response;
         }catch(err){
             throw err;
         }
    }
    async getCategoryPackages() : Promise<TPackage[]>{
        try{
             return await this._packageRepository.getCategoryPackages()
        }catch(err){
            throw err;
        }
    }
    async advanceSearch(query: QueryString) : Promise<TPackageResult> {
         try{
               return await this._packageRepository.advanceSearch(query);
         }catch(err){
             throw err;
         }
    }
    async verifyPackage(packageId : string): Promise<boolean>{
        try{
              console.log('Admin Verify Package :',packageId);
              if (!packageId) {
                  throw new Error(`Package with ID ${packageId} not found`);
              }
              const result = await this._packageRepository.updateOneById(packageId,{
                  isVerified: "approved"
               });
               if(result) {
                   return true;
               } return false;
        }catch(err){
            throw err; 
        }
    }
}