export interface Iuser{
    id:string,
    name:string;
    email:string,
    phone:string;
    status:boolean;
}
export interface IAgent{
    id:string,
    name:string;
    email:string;
    phone:string;
    status:boolean;
}
export interface ICategoryValue{
    _id:string;
    name:string;
    image:string;
}
export type IReviewData ={
    review: string;
    rating:number;
    packageId:string;
    userId:string;
}
export interface IReviewResponse{
     _id:string;
     review:string;
}
export interface IReviews{
     _id:string;
     userId:{
         _id:string;
         name:string;
     };
     packageId:string;
     review:string;
     rating:number;
}
//export type TReviewEdit = Omit<"IReviewData",'packageId' | 'userId'>; 

export type TReviewEdit ={
     review: string;
     rating: number;
}