import { inject, injectable } from "inversify";
import { IPackageRepository } from "../../Interfaces/Package/IPackageRepository";
import { IPackageService } from "../../Interfaces/Package/IPackageService";
import {
  TPackage,
  TPackageResult,
  TPackageUpdate,
  QueryString,
} from "../../Types/Package.types";
import { FilterParams } from "../../Types/Booking.types";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { TNotification } from "../../Types/notification";
import { INotificationService } from "../../Interfaces/Notification/INotificationService";

injectable();
export class PackageService implements IPackageService {
  constructor(
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("INotificationService")
    private _notificationService: INotificationService
  ) {}
  async addPackage(packageData: TPackage): Promise<boolean> {
    try {
      const data = await this._packageRepository.createNewData(packageData);
      if (data) {
        const adminId: string | null =
          await this._adminRepository.findAdminId();
        if (adminId) {
          const notification: TNotification = {
            userId: adminId,
            title: "Package",
            message: `${data.name} is created !`,
          };
          await this._notificationService.createNewNotification(notification);
        }
        return true;
      } else return false;
    } catch (err) {
      console.log("Error in Package Service !!");
      throw err;
    }
  }
  async editPackage(
    packageId: string,
    packageData: TPackage
  ): Promise<boolean> {
    try {
      const { ...updatedPackage }: TPackageUpdate = packageData;
      const result = await this._packageRepository.editPackage(
        packageId,
        updatedPackage
      );
      if (result) return true;
      else return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async deletePackage(packageId: string): Promise<boolean> {
    try {
      if (packageId) {
        const response = await this._packageRepository.deletePackage(packageId);
        if (response) return true;
        else return false;
      } else return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async findPackages(searchParams: FilterParams): Promise<TPackageResult> {
    try {
      const response: TPackageResult =
        await this._packageRepository.findPackages(searchParams);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async findAgentPackages(searchParams: FilterParams): Promise<TPackageResult> {
    try {
      const response: TPackageResult =
        await this._packageRepository.findAgentPackages(searchParams);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async getCategoryPackages(): Promise<TPackage[]> {
    try {
      const categories = await this._packageRepository.getCategoryPackages();
      return categories;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async advanceSearch(query: QueryString): Promise<TPackageResult> {
    try {
      return await this._packageRepository.advanceSearch(query);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async verifyPackage(packageId: string, value: string): Promise<boolean> {
    try {
      if (!packageId) {
        throw new Error(`Package with ID ${packageId} not found`);
      }
      const result = await this._packageRepository.updateOneById(packageId, {
        isVerified: value,
      });
      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
