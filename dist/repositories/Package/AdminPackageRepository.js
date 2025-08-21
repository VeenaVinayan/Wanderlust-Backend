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
exports.AdminPackageRepository = void 0;
const Package_1 = __importDefault(require("../../models/Package"));
const BaseRepository_1 = require("../Base/BaseRepository");
class AdminPackageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Package_1.default);
        this._packageModel = Package_1.default;
    }
    blockPackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!packageId) {
                    throw new Error(`Package with ID ${packageId} not found`);
                }
                const packages = yield this._packageModel.findById(packageId);
                if (packages) {
                    packages.isBlocked = !(packages === null || packages === void 0 ? void 0 : packages.isBlocked);
                    return yield packages.save();
                }
                else
                    return null;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.AdminPackageRepository = AdminPackageRepository;
