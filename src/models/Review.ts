import mongoose, { Types, Schema, Document } from 'mongoose';

export interface IReview extends Document{
     review : string;
     rating : number;
     packageId : Types.ObjectId;
     userId: Types.ObjectId;
}

const ReviewSchema : Schema<IReview> = new mongoose.Schema({
    review:{
           type:String,
           required: true,
    },
    rating:{
         type:Number,
         required: true,
    },
    packageId:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'Package',
         required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true}
);

const Review = mongoose.model<IReview>('Review',ReviewSchema);
export default Review;
