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
exports.UserRepository = void 0;
const BaseRepository_1 = require("../Base/BaseRepository");
const User_1 = __importDefault(require("../../models/User"));
const Category_1 = __importDefault(require("../../models/Category"));
const Package_1 = __importDefault(require("../../models/Package"));
const Review_1 = __importDefault(require("../../models/Review"));
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.default);
        this._userModel = User_1.default;
        this._categoryModel = Category_1.default;
        this._packageModel = Package_1.default;
        this._reviewModel = Review_1.default;
        this._walletModel = Wallet_1.default;
    }
    updateProfile(userId, name, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userModel.findByIdAndUpdate(userId, { name, phone }, { new: true });
            }
            catch (err) {
                console.log("Error in user repository !");
                throw err;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryModel.find({ status: true }, { _id: 1, name: 1, image: 1 });
            }
            catch (err) {
                console.log("Error in user repository !");
                throw err;
            }
        });
    }
    getPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this._packageModel
                    .find({ status: true })
                    .populate({ path: "agent", select: "_id name email phone" })
                    .sort({ price: -1 })
                    .limit(6)
                    .lean());
            }
            catch (err) {
                console.log("Error in user repository !");
                throw err;
            }
        });
    }
    addReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = new this._reviewModel(reviewData);
                const response = yield review.save();
                if (response)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.log("Error in user repository !");
                throw err;
            }
        });
    }
    getReview(userId, packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield this._reviewModel.findOne({ userId, packageId }, { review: 1, rating: 1 });
                return review;
            }
            catch (err) {
                console.log("Error in user repository !");
                throw err;
            }
        });
    }
    deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(reviewId);
                const response = yield this._reviewModel.deleteOne({ _id: id });
                if (response.deletedCount === 1)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.error("Error in user repository !");
                throw err;
            }
        });
    }
    getReviews(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._reviewModel
                    .find({ packageId })
                    .populate("userId", "name createdAt")
                    .lean();
                return data;
            }
            catch (err) {
                console.error("Error in user repository !");
                throw err;
            }
        });
    }
    getWallet(userId, filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { id, page, perPage, searchParams } = filterParams;
                const data = yield this._walletModel.findOne({ userId });
                if (!data) {
                    return null;
                }
                const search = (_a = searchParams.search) === null || _a === void 0 ? void 0 : _a.trim();
                const query = {};
                if (search) {
                    query.$or = [
                        {
                            "transaction.description": {
                                $regex: searchParams.search,
                                $options: "i",
                            },
                        },
                        {
                            "transaction.bookingId": {
                                $regex: searchParams.search,
                                $options: "i",
                            },
                        },
                    ];
                }
                const result = yield this._walletModel.aggregate([
                    { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
                    {
                        $project: {
                            amount: 1,
                            transaction: 1,
                        },
                    },
                    { $unwind: "$transaction" },
                    { $match: query },
                    {
                        $facet: {
                            paginatedTransactions: [
                                { $sort: { "transaction.transactionDate": -1 } },
                                { $skip: (page - 1) * perPage },
                                { $limit: perPage },
                                {
                                    $project: {
                                        _id: "$transaction._id",
                                        amount: "$transaction.amount",
                                        description: "$transaction.description",
                                        transactionDate: "$transaction.transactionDate",
                                        bookingId: "$transaction.bookingId",
                                    },
                                },
                            ],
                            totalCount: [{ $count: "count" }],
                            walletAmount: [
                                {
                                    $group: {
                                        _id: null,
                                        amount: { $first: "$amount" },
                                    },
                                },
                            ],
                        },
                    },
                ]);
                const resultValue = {
                    transaction: (_b = result[0]) === null || _b === void 0 ? void 0 : _b.paginatedTransactions,
                    amount: (_c = result[0].walletAmount[0]) === null || _c === void 0 ? void 0 : _c.amount,
                    totalCount: (_d = result[0].totalCount[0]) === null || _d === void 0 ? void 0 : _d.count,
                };
                return resultValue;
            }
            catch (err) {
                console.error("Error in user repository !");
                throw err;
            }
        });
    }
    editReview(data, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._reviewModel.updateOne({ _id: reviewId }, { $set: { review: data.review, rating: data.rating } });
                if (response.modifiedCount === 1)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.error("Error in user repository !");
                throw err;
            }
        });
    }
}
exports.UserRepository = UserRepository;
