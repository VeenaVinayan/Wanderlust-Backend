import { inject, injectable } from "inversify";
import { IAgentRepository } from "../../Interfaces/Agent/IAgentRepository";
import { IAgentService } from "../../Interfaces/Agent/IAgentService";
import { TCategoryValue } from "../../Types/Package.types";

@injectable()
export class AgentService implements IAgentService {
  constructor(
    @inject("IAgentRepository") private _agentRepository: IAgentRepository
  ) {}

  async uploadCertificate(userId: string, publicUrl: string): Promise<boolean> {
    try {
      const result = await this._agentRepository.uploadCertificate(
        userId,
        publicUrl
      );
      if (
        result.acknowledged &&
        result.matchedCount === 1 &&
        result.modifiedCount === 1
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getCategories(): Promise<TCategoryValue[]> {
    try {
      const data = await this._agentRepository.getCategories();
      const category = data.map((category) => ({
        _id: category._id.toString(),
        name: category.name,
      }));
      return category;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async getDashboardData(agentId: string): Promise<object> {
    try {
      const data = await this._agentRepository.getDashboardData(agentId);
      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
