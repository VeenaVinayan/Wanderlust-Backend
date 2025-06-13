import mongoose, { Types,Schema , Document } from 'mongoose';

export interface IWishlist extends Document{
    userId: Types.ObjectId;
    packageId:Types.ObjectId;
}

const WishlistSchema : Schema<IWishlist> = new mongoose.Schema({
    userId : {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
    },
    packageId: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'Package',
         required: true,
    }
},{timestamps: true}
);

const Wishlist = mongoose.model<IWishlist>('Wishlist',WishlistSchema);
export default Wishlist;

