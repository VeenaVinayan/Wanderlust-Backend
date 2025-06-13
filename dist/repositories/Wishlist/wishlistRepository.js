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
exports.WishlistRepository = void 0;
const Wishlist_1 = __importDefault(require("../../models/Wishlist"));
const BaseRepository_1 = require("../Base/BaseRepository");
class WishlistRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Wishlist_1.default);
        this._wishlistModel = Wishlist_1.default;
    }
    isExistWishlist(userId, packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Is exist in Repository !');
                const result = yield this._wishlistModel.findOne({ userId, packageId });
                if (result)
                    return true;
                else
                    return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Wishlist in Repository ', userId);
                const data = yield this._wishlistModel.find({ userId }).populate('packageId');
                console.log('DAta :: ', data);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.WishlistRepository = WishlistRepository;
