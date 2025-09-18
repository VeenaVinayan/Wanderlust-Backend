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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const inversify_1 = require("inversify");
(0, inversify_1.injectable)();
let AdminService = class AdminService {
    constructor(_adminRepository, _categoryRepository, _adminPackageRepository) {
        this._adminRepository = _adminRepository;
        this._categoryRepository = _categoryRepository;
        this._adminPackageRepository = _adminPackageRepository;
    }
    getAllData(user, perPage, page, search, sortBy, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.findAllData(user, perPage, page, search, sortBy, sortOrder);
            }
            catch (error) {
                console.log("Error in create Category |", error);
                throw new Error("Failed to retrieve users ");
            }
        });
    }
    blockOrUnblock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.blockOrUnblock(userId);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                data.name = data.name.toUpperCase();
                yield this._categoryRepository.createNewData(data);
                return true;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    getCategories(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryRepository.findAllCategory(filterParams);
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._categoryRepository.deleteCategory(categoryId);
                if (res)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    isExistCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._categoryRepository.isExistCategory(categoryName.toUpperCase());
                if (res)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    editCategory(categoryId, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._categoryRepository.updateOneById(categoryId, category);
                if (res)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    getPendingAgentData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._adminRepository.findPendingAgent(params);
                return data;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    agentApproval(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.agentApproval(agentId);
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    rejectAgentRequest(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.agentApproval(agentId);
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
    blockPackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminPackageRepository.blockPackage(packageId);
                if (result)
                    return true;
                else
                    return false;
            }
            catch (err) {
                console.log("Error in create Category |", err);
                throw err;
            }
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    __param(0, (0, inversify_1.inject)("IAdminRepository")),
    __param(1, (0, inversify_1.inject)("ICategoryRepository")),
    __param(2, (0, inversify_1.inject)("IAdminPackageRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminService);
