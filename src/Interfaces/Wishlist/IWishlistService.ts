export interface IWishlistService {
    addToWishlist(user: string, packageId : string): Promise<boolean>; 
    isExistWishlist(userId: string, packageId: string) : Promise<boolean>
    getWishlist(userId : string) : Promise<Object[]>;
    deleteWishlist(id: string):Promise<boolean>;
}
