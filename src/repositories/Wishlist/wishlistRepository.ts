import Wishlist , { IWishlist} from '../../models/Wishlist';
import { BaseRepository } from '../Base/BaseRepository';
import { IWishlistRepository } from '../../Interfaces/Wishlist/IWishlistReposiory';

export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository{
    private readonly _wishlistModel = Wishlist; 
    constructor(){
         super(Wishlist);
     }
     async isExistWishlist(userId: string, packageId: string) : Promise<boolean> {
         try{
             console.log('Is exist in Repository !');
             const result = await this._wishlistModel.findOne({userId,packageId});
             if(result) return true;
             else return false;
         }catch(err){
             throw err;
         }
     }
     async getWishlist(userId : string) : Promise<Object[]> {
        try{
            console.log('Get Wishlist in Repository ', userId);
            const data = await this._wishlistModel.find({userId}).populate('packageId');
            console.log('DAta :: ',data);
            return data;
        }catch(err){
            throw err;
        }
     }
}
