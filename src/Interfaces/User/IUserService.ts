import { Iuser } from "../../interface/User";
import { IUpdateUser } from "../../interface/User";
import {  ICategoryValue, IReviewData, IReviewResponse, TReviewEdit } from '../../Types/user.types';
import { TPackageDataDTO } from '../../DTO/packageDTO';
import { Request }  from 'express';
import { ResetPasswordResult } from '../../enums/PasswordReset';
import { FilterParams } from '../../Types/Booking.types';
import { IAgentChatDataDTO } from '../../DTO/userDTO';

export interface IUserService{
     updateUser(userId:string,name:string,phone:string):Promise<Iuser | null>;
     resetPassword(req : Request) :Promise<ResetPasswordResult>;
     getCategories():Promise<ICategoryValue[]>;
     getPackages():Promise<TPackageDataDTO[]>;
     addReview(reviewData : IReviewData): Promise<boolean>
     getReview(userId: string,packageId: string) : Promise<IReviewResponse | null>
     deleteReview(reviewId : string): Promise<boolean>;
     getReviews(packageId : string) :Promise<Object []>
     getWallet(userId: string, filterParams : FilterParams) : Promise<Object | null>
     editReview(data : TReviewEdit, reviewId : string): Promise<boolean>;
     userDetails(userId : string) : Promise<IAgentChatDataDTO | null>;
}