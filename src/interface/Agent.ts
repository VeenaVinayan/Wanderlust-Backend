import { Types } from "mongoose"; 

export interface IAgent {
  userId: Types.ObjectId; 
  address: {
    home: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
}

export interface IAgentResponse {
   address:{
    home: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
   },
   isVerified: string;
}
export interface IPendingAgent {
   id:string;
   name:string;
   email:string;
   phone:string;
   license:string;
   address:{
    home: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
   },
}
export interface IPendingAgentResponse{
    data: IPendingAgent[];
    totalCount:number;
}