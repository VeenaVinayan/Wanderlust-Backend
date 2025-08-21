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
export type TUserPayload = {
    id:string;
    email:string;
    role:'Admin' | 'Agent' | 'User';
}

export type  TUser = {
     name: string;
     email: string;
     phone:string;
     password:string;
     conPassword:string;
     home?: string;
     street?:string;
     city?:string;
     state?:string;
     country?:string;
     zipcode?:string
}
export type TAgent = TUser &  {
    address:{
       home: string;
       street?:string;
       city:string;
       state:string;
       country:string;
       zipcode:string;
    },
}
export type TUserData ={
   otp :string;
   data: TUser ;
   user:string;
}

export type IUserPayload = {
  _id: string;
  role: 'Admin' | 'User' | 'Agent';
}
