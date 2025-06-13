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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRepository = void 0;
const Agent_1 = __importDefault(require("../../models/Agent"));
const BaseRepository_1 = require("../Base/BaseRepository");
const Category_1 = __importDefault(require("../../models/Category"));
class AgentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Agent_1.default);
        this._agentModel = Agent_1.default;
        this._categoryModel = Category_1.default;
    }
    uploadCertificate(id, certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(" Agent reposiory for upload certificate !!");
                return yield Agent_1.default.updateOne({ userId: id }, {
                    $set: { license: certificate, isVerified: 'Uploaded' }
                });
            }
            catch (err) {
                console.log("Error in upload photo !");
                throw err;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryModel.find({ status: true }, { _id: 1, name: 1 });
            }
            catch (err) {
                console.log(' Error in Fetch Category !!');
                throw err;
            }
        });
    }
}
exports.AgentRepository = AgentRepository;
