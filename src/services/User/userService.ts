import { inject, injectable } from "inversify";
import { IUserService } from "../../Interfaces/User/IUserService";
import { IUserRepository } from "../../Interfaces/User/IUserRepository";
import { Iuser } from "../../interface/User";
import { Request } from "express";
import  bcryptjs  from 'bcryptjs' ;
import {IUser } from '../../models/User';
import { TPackageData } from '../../Types/Package.types';
import { ICategoryValue, IReviewData, IReviewResponse, TReviewEdit } from '../../Types/user.types';
import { ResetPasswordResult } from '../../enums/PasswordReset';
import { FilterParams } from '../../Types/Booking.types';
import  AgentMapper  from '../../mapper/userMapper';
import { IAgentChatDataDTO } from '../../DTO/userDTO';
import packageMapper from '../../mapper/packageMapper';
import { TPackageDataDTO } from "../../DTO/packageDTO";

@injectable()
export class UserService implements IUserService {
    constructor(
       @inject("IUserRepository") private _userRepository: IUserRepository
    ){}
    async updateUser(userId: string, name: string, phone: string): Promise<Iuser | null> {
         try{
               console.log(" User  service !!");
               const data =  await this._userRepository.updateProfile(userId,name,phone);
               if(data){
                  const user = {
                        id:data.id.toString(),
                        name: data.name,
                        email: data.email,
                        phone:data.phone,
                        status:data.status,
                        role:data.role,
                  }
                 return user;
             }else return null;
        }catch(err){
            throw err;
         }
    }
  
 async resetPassword(req: Request): Promise<ResetPasswordResult> {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await this._userRepository.findOneById(userId);
    if (!user) {
      return ResetPasswordResult.USER_NOT_FOUND;
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
       return ResetPasswordResult.INVALID_OLD_PASSWORD;
    }

    if (newPassword !== confirmPassword) {
      return ResetPasswordResult.INVALID_OLD_PASSWORD;
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const updateResult = await this._userRepository.updateOneById(userId, {
      password: hashedPassword,
    });

    return ResetPasswordResult.SUCCESS;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err;
  }
}
  async getCategories():Promise<ICategoryValue[]>{
        try{
            return await this._userRepository.getCategories();
        }catch(err){
            console.log(' Error in Get Category service !!');
            throw err;
        }
    }
    async  getPackages() : Promise<TPackageDataDTO[]>{
        try{
            const data =  await this._userRepository.getPackages();
            const packages : TPackageDataDTO []= packageMapper.userPackageData(data);
            return packages; 
        }catch(err){
            throw err;
        }
    }
    async addReview( reviewData : IReviewData) : Promise<boolean>{
        try{
             return await this._userRepository.addReview(reviewData);
        }catch(err){
            throw err;
        }
    }
    async getReview(userId: string, packageId: string): Promise<IReviewResponse | null>{
        try{
             return await this._userRepository.getReview(userId,packageId);
        }catch(err){
             throw err;
        }
    }
    async deleteReview(reviewId : string) : Promise<boolean>{
        try{
             return await this._userRepository.deleteReview(reviewId);
        }catch(err){
            throw err;
        }
    }
    async getReviews(packageId : string) : Promise<Object []>{
        try{
             return await this._userRepository.getReviews(packageId);
        }catch(err){
            throw err;
        }
    }
    async getWallet(userId : string, filterParams : FilterParams) : Promise<Object | null>{
        try{
            return await this._userRepository.getWallet(userId, filterParams);
        }catch(err){
            throw err;
        }
    }
    async editReview(data : TReviewEdit, reviewId : string) : Promise<boolean>{
        try{
            return await this._userRepository.editReview(data,reviewId);
        }catch(err){
            throw err;
        }
    }
    async userDetails(userId : string): Promise<IAgentChatDataDTO | null>{
         try{
                console.log("User Id :::",userId);
                const data :IUser | null= await this._userRepository.findOneById(userId);
                if(!data) return null;
                return AgentMapper.agentDataMapper(data);
         }catch(err){
              throw err;
         }
    }
}
