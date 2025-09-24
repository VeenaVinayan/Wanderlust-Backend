import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../Interfaces/Admin/IAdminRepository";
import { IAdminService } from "../../Interfaces/Admin/IAdminService";
import { ICategoryRepository } from "../../Interfaces/Admin/ICategoryRepository";
import { ICategory } from "../../interface/Interface";
import { IPendingAgentResponse } from "../../interface/Agent";
import { IAdminPackageRepository } from "../../Interfaces/Package/IAdminPackageRepository";
import { FilterParams } from "../../Types/Booking.types";
import { TCategoryResult } from "../../interface/Category.interface";

injectable();
export class AdminService implements IAdminService {
  constructor(
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository,
    @inject("IAdminPackageRepository")
    private _adminPackageRepository: IAdminPackageRepository
  ) {}

  async getAllData(
    user: string,
    perPage: number,
    page: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<object> {
    try {
      return await this._adminRepository.findAllData(
        user,
        perPage,
        page,
        search,
        sortBy,
        sortOrder
      );
    } catch (error) {
      console.log("Error in create Category |", error);
      throw new Error("Failed to retrieve users ");
    }
  }
  async blockOrUnblock(userId: string): Promise<boolean> {
    try {
      return await this._adminRepository.blockOrUnblock(userId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async addCategory(category: ICategory): Promise<boolean> {
    try {
      category.name = category.name.toUpperCase();
      await this._categoryRepository.createNewData(category);
      return true;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async getCategories(filterParams: FilterParams): Promise<TCategoryResult> {
    try {
      return await this._categoryRepository.findAllCategory(filterParams);
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const res = await this._categoryRepository.deleteCategory(categoryId);
      if (res) return true;
      else return false;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async isExistCategory(categoryName: string): Promise<boolean> {
    try {
      const res = await this._categoryRepository.isExistCategory(
        categoryName.toUpperCase()
      );
      if (res) return true;
      else return false;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async editCategory(
    categoryId: string,
    category: ICategory
  ): Promise<boolean> {
    try {
      const updatedResult = await this._categoryRepository.updateOneById(
        categoryId,
        category
      );
      if (updatedResult) return true;
      else return false;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async getPendingAgentData(
    params: FilterParams
  ): Promise<IPendingAgentResponse> {
    try {
      const pendingAgents = await this._adminRepository.findPendingAgent(params);
      return pendingAgents;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async agentApproval(agentId: string): Promise<boolean> {
    try {
      return await this._adminRepository.agentApproval(agentId);
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async rejectAgentRequest(agentId: string): Promise<boolean> {
    try {
      return await this._adminRepository.agentApproval(agentId);
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
  async blockPackage(packageId: string): Promise<boolean> {
    try {
      const result = await this._adminPackageRepository.blockPackage(packageId);
      if (result) return true;
      else return false;
    } catch (err) {
      console.log("Error in create Category |", err);
      throw err;
    }
  }
}
