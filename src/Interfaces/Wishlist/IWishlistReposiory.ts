import { IBaseRepository } from '../../Interfaces/Base/IBaseRepository';
import { IWishlist } from '../../models/Wishlist';

export interface IWishlistRepository extends IBaseRepository <IWishlist>{
    isExistWishlist(userId : string, packageId: string): Promise<boolean>;
    getWishlist(userId : string) : Promise<Object[]>;
}