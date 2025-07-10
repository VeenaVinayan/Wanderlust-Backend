import { LoginResult } from '../../interface/Interface';
import { IBaseRepository } from '../Base/IBaseRepository';
import { IUser } from'../../models/User';
import {  TPackageData } from '../../Types/Package.types';
import { ICategoryValue, IReviewData , IReviewResponse, TReviewEdit} from '../../Types/user.types';
import { IWallet } from '../../models/Wallet';
import { FilterParams } from '../../Types/Booking.types';

export interface IUserRepository extends IBaseRepository<IUser>{
    updateProfile(userId:string,name:string,phone:string): Promise<LoginResult | null>;
    getCategories(): Promise<ICategoryValue[]>;
    getPackages():Promise<TPackageData[]>;
    addReview(reviewData : IReviewData):Promise<boolean>;
    getReview(userId: string, packageId: string): Promise<IReviewResponse | null>
    deleteReview(reviewId : string) : Promise<boolean>;
    getReviews(packageId : string): Promise<Object []>;
    getWallet(userId : string, filterParams : FilterParams): Promise<Object | null>;
    editReview(data : TReviewEdit, reviewId : string): Promise<boolean>;
}