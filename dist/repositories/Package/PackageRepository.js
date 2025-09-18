"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.PackageRepository = void 0;
const inversify_1 = require("inversify");
const BaseRepository_1 = require("../Base/BaseRepository");
const Package_1 = __importDefault(require("../../models/Package"));
const mongoose_1 = require("mongoose");
let PackageRepository = class PackageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Package_1.default);
        this._packageModel = Package_1.default;
    }
    editPackage(packageId, packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPackage = yield this._packageModel.findByIdAndUpdate(packageId, { $set: packageData }, { new: true, runValidators: true });
                return updatedPackage;
            }
            catch (err) {
                console.log("Error in package edit :", err);
                throw err;
            }
        });
    }
    deletePackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield this._packageModel.findOne({ _id: packageId });
                if (packageData) {
                    packageData.status = !(packageData === null || packageData === void 0 ? void 0 : packageData.status);
                    yield packageData.save();
                    return true;
                }
                else
                    return false;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    findPackages(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, perPage, searchParams } = filterParams;
                const query = {};
                if (searchParams.search) {
                    query["$or"] = [
                        { description: { $regex: searchParams.search, $options: "i" } },
                        { name: { $regex: searchParams.search, $options: "i" } },
                    ];
                }
                const sortOptions = {};
                if (searchParams.sortBy) {
                    sortOptions[searchParams.sortBy] =
                        searchParams.sortOrder === "asc" ? 1 : -1;
                }
                const [data, totalCount] = yield Promise.all([
                    this._packageModel
                        .find(query)
                        .populate("agent", "_id name email phone")
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .sort(sortOptions)
                        .exec(),
                    this._packageModel.countDocuments(query).exec(),
                ]);
                const packageData = {
                    packages: data,
                    totalCount,
                };
                return packageData;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    findAgentPackages(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, page, perPage, searchParams } = filterParams;
                const query = {};
                if (id) {
                    query.agent = id;
                }
                if (searchParams.search) {
                    query.$or = [
                        { name: { $regex: searchParams.search, $options: "i" } },
                        { description: { $regex: searchParams.search, $options: "i" } },
                    ];
                }
                const sortOptions = {};
                if (searchParams.sortBy) {
                    sortOptions[searchParams.sortBy] =
                        searchParams.sortOrder === "asc" ? 1 : -1;
                }
                const [data, totalCount] = yield Promise.all([
                    this._packageModel
                        .find(query)
                        .sort(sortOptions)
                        .skip((page - 1) * perPage)
                        .limit(perPage),
                    this._packageModel.countDocuments(query),
                ]);
                const packageData = {
                    packages: data,
                    totalCount,
                };
                return packageData;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Error fetching users !");
            }
        });
    }
    getCategoryPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield this._packageModel.find();
                return packages;
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in Get Category !!");
            }
        });
    }
    advanceSearch(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchQuery = queryString;
                const page = Number(queryString.page);
                const perPage = Number(queryString.perPage);
                const matchStage = {};
                const sortStage = {};
                const categoryArray = searchQuery.category
                    ? searchQuery.category.split(",")
                    : [];
                if (categoryArray.length > 0) {
                    matchStage.category = {
                        $in: categoryArray
                            .map((id) => mongoose_1.Types.ObjectId.isValid(id) ? new mongoose_1.Types.ObjectId(id) : null)
                            .filter((id) => id !== null),
                    };
                }
                if (searchQuery.keyword) {
                    matchStage.$or = [
                        {
                            name: { $regex: searchQuery.keyword, $options: "i", $exists: true },
                        },
                        {
                            description: {
                                $regex: searchQuery.keyword,
                                $options: "i",
                                $exists: true,
                            },
                        },
                    ];
                }
                if (searchQuery.price) {
                    if (searchQuery.price === "50000+") {
                        matchStage.price = { $gte: 50000 };
                    }
                    else {
                        const [minPrice, maxPrice] = searchQuery.price
                            .split("-")
                            .map(Number);
                        matchStage.price = { $gte: minPrice, $lte: maxPrice };
                    }
                }
                if (searchQuery.sort) {
                    if (searchQuery.sort === "price-low")
                        sortStage.price = 1;
                    else if (searchQuery.sort === "price-high")
                        sortStage.price = -1;
                    else if (searchQuery.sort === "A-Z")
                        sortStage.name = 1;
                    else if (searchQuery.sort === "Z-A")
                        sortStage.name = -1;
                }
                else {
                    sortStage.price = 1;
                }
                const [data, totalCount] = yield Promise.all([
                    this._packageModel
                        .find(matchStage)
                        .populate("agent", "_id name email phone")
                        .sort(sortStage)
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .lean(),
                    this._packageModel.countDocuments(matchStage),
                ]);
                const formattedResult = {
                    packages: data,
                    totalCount: totalCount,
                };
                return formattedResult;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
};
exports.PackageRepository = PackageRepository;
exports.PackageRepository = PackageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PackageRepository);
