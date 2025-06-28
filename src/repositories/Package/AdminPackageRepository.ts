import { IAdminPackageRepository } from '../../Interfaces/Package/IAdminPackageRepository';
import Package, { IPackage} from '../../models/Package';
import { BaseRepository } from '../Base/BaseRepository';

export class AdminPackageRepository extends BaseRepository<IPackage> implements IAdminPackageRepository
{  
     private readonly _packageModel = Package;
     constructor(){
          super(Package);
     }
     async blockPackage(packageId: string) :Promise<IPackage | null>{
        try{
            console.log('Admin block / UNblock packages');
            if (!packageId) {
                throw new Error(`Package with ID ${packageId} not found`);
            }
             const packages = await this._packageModel.findById(packageId);
             if(packages){
                packages.isBlocked = !packages?.isBlocked;
                return await packages.save();
             }else return null;
        }catch(err){
             throw err;
        }
    }
    
}
