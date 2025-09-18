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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const PasswordReset_1 = require("../../enums/PasswordReset");
const userMapper_1 = __importDefault(require("../../mapper/userMapper"));
const packageMapper_1 = __importDefault(require("../../mapper/packageMapper"));
let UserService = class UserService {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    updateUser(userId, name, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._userRepository.updateProfile(userId, name, phone);
            if (data) {
                const user = {
                    id: data.id.toString(),
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    status: data.status,
                    role: data.role,
                };
                return user;
            }
            else
                return null;
        });
    }
    resetPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { oldPassword, newPassword, confirmPassword } = req.body;
                const user = yield this._userRepository.findOneById(userId);
                if (!user) {
                    return PasswordReset_1.ResetPasswordResult.USER_NOT_FOUND;
                }
                const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
                if (!isMatch) {
                    return PasswordReset_1.ResetPasswordResult.INVALID_OLD_PASSWORD;
                }
                if (newPassword !== confirmPassword) {
                    return PasswordReset_1.ResetPasswordResult.INVALID_OLD_PASSWORD;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                yield this._userRepository.updateOneById(userId, {
                    password: hashedPassword,
                });
                return PasswordReset_1.ResetPasswordResult.SUCCESS;
            }
            catch (err) {
                console.error("Error resetting password:", err);
                throw err;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._userRepository.getCategories();
            }
            catch (err) {
                console.error(" Error in Get Category service !!");
                throw err;
            }
        });
    }
    getPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._userRepository.getPackages();
            const packages = packageMapper_1.default.userPackageData(data);
            return packages;
        });
    }
    addReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.addReview(reviewData);
        });
    }
    getReview(userId, packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getReview(userId, packageId);
        });
    }
    deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.deleteReview(reviewId);
        });
    }
    getReviews(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getReviews(packageId);
        });
    }
    getWallet(userId, filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getWallet(userId, filterParams);
        });
    }
    editReview(data, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.editReview(data, reviewId);
        });
    }
    userDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._userRepository.findOneById(userId);
            if (!data)
                return null;
            return userMapper_1.default.agentDataMapper(data);
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IUserRepository")),
    __metadata("design:paramtypes", [Object])
], UserService);
