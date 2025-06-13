import { FilterParams } from "../../Types/Booking.types";
import { TPackage , TPackageResult, QueryString ,TAgentPackage} from "../../Types/Package.types";

export interface IPackageService {
   addPackage(packageData: TPackage): Promise<boolean>
   editPackage(packageId: string, packageData : TPackage): Promise<boolean>
   deletePackage(packageId : string) : Promise<boolean>
   findAgentPackages(searchParams : FilterParams):Promise<TPackageResult>
   getCategoryPackages(): Promise<TPackage[]>
   advanceSearch(query : Object) : Promise<TPackageResult>
   findPackages(filterParams : FilterParams) : Promise<TPackageResult>
}