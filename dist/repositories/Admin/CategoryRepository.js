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
exports.CategoryRepository = void 0;
const inversify_1 = require("inversify");
const Category_1 = __importDefault(require("../../models/Category"));
const BaseRepository_1 = require("../Base/BaseRepository");
let CategoryRepository = class CategoryRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Category_1.default);
        this._categoryModel = Category_1.default;
    }
    isExistCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._categoryModel.findOne({ name: categoryName });
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Delete Category !! Repository');
                const category = yield this._categoryModel.findById(categoryId);
                console.log("Category ::: ", category);
                if (category) {
                    category.status = !category.status;
                    const res = yield category.save();
                    if (res)
                        return true;
                    else
                        return false;
                }
                return false;
            }
            catch (err) {
                console.log('Delete Category !! Repository, catch');
                throw err;
            }
        });
    }
    findAllCategory(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('Inside get Categories !!');
                const { page, perPage, searchParams } = filterParams;
                const query = {
                    status: true,
                };
                if (searchParams.search) {
                    query.$or = [
                        { name: { $regex: searchParams.search, $options: 'i' } },
                        { description: { $regex: searchParams.search, $options: 'i' } },
                    ];
                }
                const sortOptions = {};
                if (searchParams.sortBy) {
                    sortOptions[searchParams.sortBy] = searchParams.sortOrder === 'asc' ? 1 : -1;
                }
                const [data, totalCount] = yield Promise.all([
                    this._categoryModel
                        .find(query)
                        .sort(sortOptions)
                        .skip((page - 1) * perPage)
                        .limit(perPage),
                    this._categoryModel.countDocuments(query),
                ]);
                return { data, totalCount };
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CategoryRepository);
