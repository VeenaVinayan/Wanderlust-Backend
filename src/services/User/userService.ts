import { inject, injectable } from "inversify";
import { IUserService } from "../../Interfaces/User/IUserService";
import { IUserRepository } from "../../Interfaces/User/IUserRepository";
import { Iuser } from "../../interface/User";
import { Request } from "express";
import  bcryptjs  from 'bcryptjs' ;
import {IUser } from '../../models/User';
import { TPackage } from '../../Types/Package.types';
import { ICategoryValue, IReviewData, IReviewResponse, TReviewEdit } from '../../Types/user.types';
import { IWallet } from '../../models/Wallet';
import { ResetPasswordResult } from '../../enums/PasswordReset';
import { FilterParams } from '../../Types/Booking.types';

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
                  console.log(" The  user result :: ",user )
                  return user;

               }else return null;
                             
         }catch(err){
               throw err;
         }
    }
  
 async resetPassword(req: Request): Promise<ResetPasswordResult> {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    console.log("Values are:", id, oldPassword, newPassword, confirmPassword);

    const user = await this._userRepository.findOneById(id);
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

    const updateResult = await this._userRepository.updateOneById(id, {
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
            console.log(' Get Catgory service !!');
            return await this._userRepository.getCategories();
        }catch(err){
            console.log(' Error in Get Category service !!');
            throw err;
        }
    }
    async  getPackages() : Promise<TPackage[]>{
         try{
            console.log(' Get Catgory service !!');
            return await this._userRepository.getPackages();
         }catch(err){
             console.error('Error in Fetch package in SERvices ',err);
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
    async userDetails(userId : string): Promise<Object | null>{
         try{
                console.log("User Id :::",userId);
                const data = await this._userRepository.findOneById(userId);
                const user = {
                     _id:data?._id?.toString(),
                     name:data?.name,
                }
                console.log(" User DAta ==", user);
                return user;
         }catch(err){
              throw err;
         }
    }
}
