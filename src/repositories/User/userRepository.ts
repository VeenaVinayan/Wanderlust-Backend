import { BaseRepository } from "../Base/BaseRepository";
import User ,{ IUser} from '../../models/User';
import { IUserRepository } from "../../Interfaces/User/IUserRepository";
import { LoginResult  } from "../../interface/Interface";
import Category from '../../models/Category';
import { ICategoryValue , IReviewData , IReviewResponse , IReviews, TReviewEdit} from '../../Types/user.types'
import Package from "../../models/Package";
import { TPackage, TPackageData } from  '../../Types/Package.types';
import Review from '../../models/Review';
import Wallet , { IWallet } from '../../models/Wallet';
import  mongoose ,{ FilterQuery}  from 'mongoose';
import { FilterParams } from '../../Types/Booking.types';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
     private readonly _userModel = User;
     private readonly _categoryModel = Category;
     private readonly _packageModel = Package;
     private readonly _reviewModel = Review;
     private readonly _walletModel = Wallet;
     constructor(){
         super(User);
     }
    async updateProfile( userId: string, name:string,phone:string) :Promise<LoginResult | null> {
           try{
                console.log('In user Repository !',userId,name,phone);
                return await this._userModel.findByIdAndUpdate(userId,
                  {name,phone},
                  {new : true} )
           }catch(err){
               console.log("Error in user repository !");
               throw err;
           }
     }
    async getCategories(): Promise<ICategoryValue[]>{
      try{
            console.log('Inside Repository !!');
            return await this._categoryModel.find({status:true},{_id:1,name:1,image:1})
      }catch(err){
           console.log('Error in Get Category in Landing page!!');
           throw err;
      }
     }
     async getPackages(): Promise<TPackageData[]>{
       try{
            console.log('Fetch Packages !');
            return await this._packageModel.find({status:true})
                                            .populate({ path: 'agent', select: '_id name email phone' })
                                            .sort({price:-1}) 
                                            .limit(6)
                                            .lean() as unknown as TPackageData[]; 
       }catch(err){
            console.log('Error in get Packages !!!');
            throw err;
       }
     }
     async addReview(reviewData : IReviewData): Promise<boolean>{
          try{
               const review = new this._reviewModel(reviewData);
               const response = await review.save();
               if(response) return true;
               else return false;
          }catch(err){
                throw err;
          }
     }
     async getReview(userId : string, packageId: string): Promise<IReviewResponse| null>{
           try{
               const review : IReviewResponse | null = await this._reviewModel.findOne({userId,packageId},{review:1,rating:1});
                return review;
           }catch(err){
              throw err;
           }
     }
     async deleteReview(reviewId : string): Promise<boolean>{
          try{
               const id = new mongoose.Types.ObjectId(reviewId);
               const response = await this._reviewModel.deleteOne({_id:id});
               if(response.deletedCount === 1) return true;
               else return false;
          }catch(err){
               throw err;
          }
     }
     async getReviews(packageId : string) : Promise<Object[]>{
          try{
               console.log('in repository get Reviews ::',packageId);
               const data = await this._reviewModel.find({packageId}).populate('userId','name createdAt').lean();
               console.log("DAta is ::",data, typeof data);
               return data;
          }catch(err){
               throw err;
          }
     } 
     async getWallet(userId : string, filterParams : FilterParams) : Promise<Object | null>{
          try{
              console.log('IN Wallet Repository :::' , filterParams);
              const { id, page, perPage, searchParams } = filterParams;
              const data : IWallet | null = await this._walletModel.findOne({userId});
              if(!data){
                  return null;
               }
             const search = searchParams.search?.trim();
              const query : FilterQuery<IWallet> = {};
              if(search){
               query.$or = [
                 {'transaction.description': { $regex: searchParams.search, $options: 'i' } },
                 {'transaction.bookingId': { $regex:searchParams.search,$options:'i'}},
               ];
             }
              const result = await this._walletModel.aggregate([
                 { $match: { userId: new mongoose.Types.ObjectId(id) } },
                    {
                     $project: {
                         amount: 1,
                         transaction: 1
                    }
                },
               {  $unwind: '$transaction' },
               {$match: query}, 
               {
                 $facet: {
                    paginatedTransactions: [
                        { $sort: { 'transaction.transactionDate':  -1 } },
                        { $skip: (page - 1) * perPage },
                        { $limit: perPage },
                        {
                          $project: {
                               _id: '$transaction._id',
                               amount: '$transaction.amount',
                               description: '$transaction.description',
                               transactionDate: '$transaction.transactionDate',
                           },
                        },
                    ],
                   totalCount: [
                        { $count: 'count' },
                          ],
                   walletAmount: [
                       {
                            $group: {
                                 _id: null,
                                 amount: { $first: '$amount' }
                           }
                         }
                      ]
                   },
                   },
              ]);
              const resultValue = {
                  transaction : result[0]?.paginatedTransactions,
                  amount:result[0].walletAmount[0]?.amount,
                  totalCount: result[0].totalCount[0]?.count,
              }
          console.log("Result Value is :: ",resultValue);
          return resultValue;
     }catch(err){
               throw err;
          }
     }
     async editReview(data : TReviewEdit, reviewId: string)    : Promise<boolean>{
          try{
               const response = await this._reviewModel.updateOne({_id:reviewId},{$set:{review:data.review,rating:data.rating}});
               if(response.modifiedCount === 1) return true;
               else return false;
          }catch(err){
               throw err;
          }
     }  
     
 } 
