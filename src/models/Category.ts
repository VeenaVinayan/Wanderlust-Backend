import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document{
    _id : string;
    name:string;
    description:string;
    image:string;
    status:boolean;
 };

const CategorySchema: Schema = new mongoose.Schema({
     name :{
          type: String,
          unique:true,
          required:true,
     },
     description:{
         type:String,
         required:true,
     },
     image:{
          type:String,
          required:true,
     },
     status:{
          type:Boolean,
          default:true,
     }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;