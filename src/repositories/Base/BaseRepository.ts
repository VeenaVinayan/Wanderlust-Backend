import { Model } from "mongoose";
import { IBaseRepository } from "../../Interfaces/Base/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T>{
    constructor( private readonly _model: Model<T>)  { }

    async createNewData(data:Partial<T>): Promise<T> {
        console.log('Base Repository created !');
        return await this._model.create(data);
    }
    async findOneById(id: string): Promise<T | null> {
        console.log('Base Repository ');
        return await this._model.findById(id).exec();
     }
     async findAllData(): Promise<T[]> {
        console.log("Find All data");
         return await this._model.find().exec();
     }
     async updateOneById(id: string, data: Partial<T>): Promise<T | null> {
         console.log("Update One by Id !",id);
         return await this._model.findByIdAndUpdate(id, {$set: data}, {new : true});
     }
     async deleteOneById(id: string): Promise<boolean> {
         console.log(" Delete one by Id");
         const result = await this._model.findByIdAndDelete(id).exec();
         return result!==null;
     }
}