import { Types } from 'mongoose';
import  { FilterQuery } from 'mongoose';

export type TCategoryValue = {
     _id: string;
     name:string;
}
export type TPackage = {
     _id:string;
     name:string;
     agent:Types.ObjectId;
     category:Types.ObjectId;
     description:string;
     images:string[];
     status:boolean;
     day:number;
     night:number;
     price:number;
     totalCapacity:number;
     discount?:number;
     itinerary:{
         day:number;
         description:string;
         activities:string;
         meals:string[];
         stay:string;
         transfer:string;
      }[],
     coordinates?:{
         latitude:number,
         longitude:number,  
     }
}
export type TPackageUpdate = Omit<TPackage, '_id' | 'status'>;

export type TPackageResult = {
      packages: TPackageData[]
      totalCount: number;
}

export type QueryString = {
     price?:string;
     duration?:string;
     category?:string;
     keyword?:string;
     sort?:string;
     page:string;
     perPage:string;
}

export type PackageQuery = FilterQuery<TPackage>

export type TAgentPackage = {
     packages : {
           _id : string;
           agentName : string;
           totalPackages : number;
     }[],
     totalCount: number;
}

export type TPackageData = Omit<TPackage, 'agent'> & {
     agent:{
           _id:string;
           name:string;
           email:string;
           phone:string;
      }
}