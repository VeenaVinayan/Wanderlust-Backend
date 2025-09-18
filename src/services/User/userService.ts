import { inject, injectable } from "inversify";
import { IUserService } from "../../Interfaces/User/IUserService";
import { IUserRepository } from "../../Interfaces/User/IUserRepository";
import { Iuser } from "../../interface/User";
import { Request } from "express";
import bcryptjs from "bcryptjs";
import { IUser } from "../../models/User";
import {
  ICategoryValue,
  IReviewData,
  IReviewResponse,
  TReviewEdit,
} from "../../Types/user.types";
import { ResetPasswordResult } from "../../enums/PasswordReset";
import { FilterParams } from "../../Types/Booking.types";
import AgentMapper from "../../mapper/userMapper";
import { IAgentChatDataDTO } from "../../DTO/userDTO";
import packageMapper from "../../mapper/packageMapper";
import { TPackageDataDTO } from "../../DTO/packageDTO";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository
  ) {}
  async updateUser(
    userId: string,
    name: string,
    phone: string
  ): Promise<Iuser | null> {
    const data = await this._userRepository.updateProfile(userId, name, phone);
    if (data) {
      const user = {
        id: data.id.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        role: data.role,
      };
      return user;
    } else return null;
  }
  async resetPassword(req: Request): Promise<ResetPasswordResult> {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const user = await this._userRepository.findOneById(userId);
      if (!user) {
        return ResetPasswordResult.USER_NOT_FOUND;
      }

      const isMatch = await bcryptjs.compare(oldPassword, user.password);
      if (!isMatch) {
        return ResetPasswordResult.INVALID_OLD_PASSWORD;
      }

      if (newPassword !== confirmPassword) {
        return ResetPasswordResult.INVALID_OLD_PASSWORD;
      }

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      await this._userRepository.updateOneById(userId, {
        password: hashedPassword,
      });

      return ResetPasswordResult.SUCCESS;
    } catch (err) {
      console.error("Error resetting password:", err);
      throw err;
    }
  }
  async getCategories(): Promise<ICategoryValue[]> {
    try {
      return await this._userRepository.getCategories();
    } catch (err) {
      console.error(" Error in Get Category service !!");
      throw err;
    }
  }
  async getPackages(): Promise<TPackageDataDTO[]> {
    const data = await this._userRepository.getPackages();
    const packages: TPackageDataDTO[] = packageMapper.userPackageData(data);
    return packages;
  }
  async addReview(reviewData: IReviewData): Promise<boolean> {
    return await this._userRepository.addReview(reviewData);
  }
  async getReview(
    userId: string,
    packageId: string
  ): Promise<IReviewResponse | null> {
    return await this._userRepository.getReview(userId, packageId);
  }
  async deleteReview(reviewId: string): Promise<boolean> {
    return await this._userRepository.deleteReview(reviewId);
  }
  async getReviews(packageId: string): Promise<object[]> {
    return await this._userRepository.getReviews(packageId);
  }
  async getWallet(
    userId: string,
    filterParams: FilterParams
  ): Promise<object | null> {
    return await this._userRepository.getWallet(userId, filterParams);
  }
  async editReview(data: TReviewEdit, reviewId: string): Promise<boolean> {
    return await this._userRepository.editReview(data, reviewId);
  }
  async userDetails(userId: string): Promise<IAgentChatDataDTO | null> {
    const data: IUser | null = await this._userRepository.findOneById(userId);
    if (!data) return null;
    return AgentMapper.agentDataMapper(data);
  }
}
