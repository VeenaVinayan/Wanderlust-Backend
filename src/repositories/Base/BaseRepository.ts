import { Model } from "mongoose";
import { IBaseRepository } from "../../Interfaces/Base/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly _model: Model<T>) {}

  async createNewData(data: Partial<T>): Promise<T> {
    return await this._model.create(data);
  }
  async findOneById(id: string): Promise<T | null> {
    return await this._model.findById(id).exec();
  }
  async findAllData(): Promise<T[]> {
    return await this._model.find().exec();
  }
  async updateOneById(id: string, data: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  }
  async deleteOneById(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
