import { injectable } from "inversify";
import { BaseRepository } from "../Base/BaseRepository";
import Package ,{ IPackage } from '../../models/Package';
import { IPackageRepository } from '../../Interfaces/Package/IPackageRepository';
import { TPackageUpdate , TPackageResult , TPackage, QueryString, TAgentPackage } from '../../Types/Package.types';
import { FilterParams } from '../../Types/Booking.types';
import { Types } from 'mongoose';

@injectable()
export class PackageRepository extends BaseRepository<IPackage> implements IPackageRepository{
   private readonly _packageModel = Package;
   constructor(){
      super(Package);
   }
   async editPackage(packageId: string, packageData: TPackageUpdate): Promise<IPackage | null> {
      try {
          console.log("Edit package in repository!!",packageData);
          const updatedPackage = await this._packageModel.findByIdAndUpdate(
              packageId,
              { $set: packageData },
              { new: true, runValidators: true } 
          );
          console.log("After update ::", updatedPackage);
          return updatedPackage;
      } catch (err) {
          console.log("Error in package edit :",err);
          throw err;
      }
  }
  async deletePackage(packageId: string) :Promise<boolean> {
     try{
          console.log('Delete Package agent ', packageId);
          const packageData = await this._packageModel.findOne({_id:packageId});
          if(packageData){
            packageData.status = !packageData?.status;  
            await packageData.save();
            return true;
          }else return false;
      }catch(err : unknown){
        throw err;
      }
  }
  async findPackages(filterParams : FilterParams) : Promise<TPackageResult>{
    try {
        const {page, perPage, searchParams } = filterParams;
        const query : any = {};
         if (searchParams.search) {
          query["$or"] = [
            { description: { $regex: searchParams.search, $options: 'i' } },
            { name: { $regex: searchParams.search, $options:'i'}},
          ];
       }
        const sortOptions : any = {}
               if(searchParams.sortBy){
                  sortOptions[searchParams.sortBy] = searchParams.sortOrder === 'asc' ? 1 : -1
               }
        const [data , totalCount ]  = await Promise.all([ this._packageModel.find(query)
                          .skip((page-1)*perPage)
                          .limit(perPage)
                          .sort(sortOptions)
                          .exec(),
                       this._packageModel.countDocuments(query).exec()
            ]); 
        const packageData : TPackageResult ={
            packages : data,
            totalCount
        }  
        console.log('Packages ::',packageData);  
        return packageData;
   }catch(err){
       throw err;
   }
}
  
  async findAgentPackages(filterParams : FilterParams) : Promise<TPackageResult>{
    try {
              const { id,page,perPage, searchParams } = filterParams;
               const query : any = {};
               if(id){
                 query.agent = id;
               }
               if(searchParams.search){
                 query.$or = [
                    { name: { $regex: searchParams.search,$options:'i'}},
                    {description: {$regex: searchParams.search,$options:'i'}},
                 ]
               }
               const sortOptions : any = {}
               if(searchParams.sortBy){
                  sortOptions[searchParams.sortBy] = searchParams.sortOrder === 'asc' ? 1 : -1
               }
               const [ data , totalCount] = await Promise.all([
                this._packageModel
                        .find(query)
                        .sort(sortOptions)
                        .skip((page-1)*perPage)
                        .limit(perPage),
                this._packageModel.countDocuments(query)
        ])
        const packageData : TPackageResult={
            packages: data,
            totalCount,
        }
       return packageData;
    }catch(error){
        console.error("Error fetching users:",error);
        throw new Error("Error fetching users !");
       }
  }
  async getCategoryPackages() : Promise<TPackage[]>{
     try{
          const packages : TPackage[] = await this._packageModel.find();
          return packages;  
     }catch(err){
          throw new Error('Error in Get Category !!');
     }
 }

async advanceSearch(queryString: QueryString): Promise<TPackageResult> {
  try {
    console.log("Advance search with aggregation !!");
    const searchQuery = queryString;
    const page = Number(queryString.page);
    const perPage = Number(queryString.perPage);
    let matchStage: any = {};
    let sortStage: any = {};
 
    const categoryArray = searchQuery.category
      ? (searchQuery.category as string).split(",")
      : [];

   if (categoryArray.length > 0) {
     matchStage.category = {
     $in: categoryArray.map((id) =>
      Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null
    ).filter((id) => id !== null)
  };
}
 if(searchQuery.keyword){
      matchStage.$or = [
        { name: { $regex: searchQuery.keyword, $options: "i", $exists: true } },
        { description: { $regex: searchQuery.keyword, $options: "i", $exists: true } }
      ];
    } 
  if (searchQuery.price) {
      if (searchQuery.price === "50000+") {
        matchStage.price = { $gte: 50000 };
      } else {
        const [minPrice, maxPrice] = (searchQuery.price as string).split("-").map(Number);
        matchStage.price = { $gte: minPrice, $lte: maxPrice };
      }
    }
  
   if (searchQuery.sort) {
      if (searchQuery.sort === "price-low") sortStage.price = 1;
      else if (searchQuery.sort === "price-high") sortStage.price = -1;
      else if (searchQuery.sort === "A-Z") sortStage.name = 1;
      else if (searchQuery.sort === "Z-A") sortStage.name = -1;
    } else {
      sortStage.price = 1;
    }
    console.log("Aggregation Params:", matchStage, sortStage);
    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          data: [
            { $sort: sortStage },
            { $skip: (page - 1) * perPage },
            { $limit: perPage }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ];
    const response = await this._packageModel.aggregate(pipeline);
    const result = response[0];
    const formattedResult: TPackageResult = {
      packages: result.data,
      totalCount: result.totalCount[0]?.count || 0
    };
    return formattedResult;
  } catch (err) {
    throw err;
  }
}
}