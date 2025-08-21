import { ICategory } from '../models/Category';

export interface ICategoryResponse extends ICategory{
    
}
export type TCategory={
    _id:string;
    name:string;
    description:string;
    image:string;
    status:boolean;
}

export type TCategoryResult = {
    categories : TCategory[];
    totalCount:number;
}