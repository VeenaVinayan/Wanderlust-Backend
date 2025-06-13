import { IPackage } from '../../models/Package';
import { IBaseRepository } from '../Base/IBaseRepository';

export interface IAdminPackageRepository extends IBaseRepository<IPackage>{
     blockPackage(packageId: string) : Promise<IPackage | null>
}