"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(_model) {
        this._model = _model;
    }
    createNewData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.create(data);
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findById(id).exec();
        });
    }
    findAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.find().exec();
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._model.findByIdAndDelete(id).exec();
            return result !== null;
        });
    }
}
exports.BaseRepository = BaseRepository;
