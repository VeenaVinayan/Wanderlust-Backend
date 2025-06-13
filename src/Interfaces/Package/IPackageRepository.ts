import { IBaseRepository } from "../Base/IBaseRepository";
import { IPackage } from "../../models/Package";
import { TPackageUpdate , TPackageResult , TPackage, QueryString, TAgentPackage } from "../../Types/Package.types";
import { FilterParams } from "../../Types/Booking.types";

export interface IPackageRepository extends IBaseRepository<IPackage>{
    editPackage(packageId: string, packageData: TPackageUpdate): Promise<IPackage | null>
    deletePackage(packageId : string):Promise<boolean>
    findAgentPackages(searchParams : FilterParams) : Promise<TPackageResult>
    findPackages(filterParams : FilterParams) : Promise<TPackageResult>;
    getCategoryPackages(): Promise<TPackage[]>
    advanceSearch(queryString : QueryString):Promise<TPackageResult>
}