import { BaseRepository } from "../Base/BaseRepository";
import { IUser } from "../../models/User";
import { IAuthRepository } from "../../Interfaces/Auth/IAuthRepository";
import User from "../../models/User";
import Otp from "../../models/Otp";
import Agent, { IAgent } from "../../models/Agent";
import { IAgentResponse } from "../../interface/Agent";
import { UserOtp, OtpData, LoginResult } from "../../interface/Interface";

export class AuthRepository
  extends BaseRepository<IUser>
  implements IAuthRepository
{
  private readonly _userModel = User;
  private readonly _otpModel = Otp;
  private readonly _agentModel = Agent;
  constructor() {
    super(User);
  }
  async isUserExist(email: string): Promise<LoginResult | null> {
    try {
      const user: LoginResult | null = await this._userModel.findOne({
        email: email,
      });
      return user;
    } catch (err) {
      console.error("Error occurred ::", err);
      throw err;
    }
  }
  async getOtp(email: string): Promise<UserOtp | null> {
    const userOtp: UserOtp | null = await this._otpModel.findOne({
      email: email,
    });
    if (!userOtp) {
      throw new Error("OTP not found for the given email !");
    }
    return userOtp;
  }
  async saveOtp(email: string, otp: string): Promise<void> {
    const otpData = new Otp({
      email,
      otp,
    });
    await otpData.save();
  }
  async updateOtp(otpData: OtpData): Promise<string> {
    const updatedOtp: string = await this._otpModel.findOneAndUpdate(
      { email: otpData.email },
      {
        otp: otpData.otp,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );
    return updatedOtp;
  }
  async login(email: string): Promise<LoginResult | null> {
    const user: LoginResult | null = await this._userModel.findOne(
      { email: email },
      { _id: 1, name: 1, email: 1, password: 1, phone: 1, role: 1, status: 1 }
    );
    return user;
  }
  async resetPassword(id: string, hashPassword: string): Promise<void> {
    await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true });
  }
  async registerAgent(agentData: IAgent): Promise<boolean> {
    try {
      const agent = new Agent(agentData);
      await agent.save();
      return true;
    } catch (err) {
      console.log("Error in Register Agent !!");
      throw err;
    }
  }
  async getAgentData(id: string): Promise<IAgentResponse | null> {
    try {
      return await this._agentModel
        .findOne({ userId: id }, { address: 1, isVerified: 1, _id: 0 })
        .lean();
    } catch (err) {
      console.error("Error in agent data fetch");
      throw err;
    }
  }
}
