import { IWishlistService } from "../../Interfaces/Wishlist/IWishlistService";
import { inject, injectable } from 'inversify';
import  { IWishlistRepository } from '../../Interfaces/Wishlist/IWishlistReposiory';
import mongoose from 'mongoose';
import { IWishlist } from '../../models/Wishlist';

@injectable()
export class WishlistService implements IWishlistService{
     constructor(
         @inject("IWishlistRepository") private _wishlistRepository : IWishlistRepository
         ){}
      async addToWishlist(user : string, packageId : string): Promise<boolean>{
         if(!user || !packageId) return false;
         const data :Partial<IWishlist>= {
             userId : new mongoose.Types.ObjectId(user),
             packageId : new mongoose.Types.ObjectId(packageId),
         }
         const response = await this._wishlistRepository.createNewData(data);
         if(response) return true;
         else return false;
     } 
     async isExistWishlist(user : string, packageId : string) : Promise<boolean> {
            return await this._wishlistRepository.isExistWishlist(user,packageId);
     }
     async getWishlist(userId: string) : Promise<object[]> {
       return await this._wishlistRepository.getWishlist(userId);
           
     }
     async deleteWishlist(wishlistId : string) : Promise<boolean> {
          return await this._wishlistRepository.deleteOneById(wishlistId);
     }
    }
