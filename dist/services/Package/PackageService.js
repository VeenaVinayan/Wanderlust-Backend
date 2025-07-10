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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const inversify_1 = require("inversify");
(0, inversify_1.injectable)();
let PackageService = class PackageService {
    constructor(_adminRepository, _packageRepository, _notificationService) {
        this._adminRepository = _adminRepository;
        this._packageRepository = _packageRepository;
        this._notificationService = _notificationService;
    }
    addPackage(packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._packageRepository.createNewData(packageData);
                if (data) {
                    const adminId = yield this._adminRepository.findAdminId();
                    if (adminId) {
                        const notification = {
                            userId: adminId,
                            title: 'Package',
                            message: `${data.name} is created !`,
                        };
                        const res = yield this._notificationService.createNewNotification(notification);
                        console.log('Notification created succesfully ::', res);
                    }
                    return true;
                }
                else
                    return false;
            }
            catch (err) {
                console.log('Error in Package Service !!');
                throw err;
            }
        });
    }
    editPackage(packageId, packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Package edit in service !");
                const updatedPackage = __rest(packageData, []);
                console.log("Updated package ::", updatedPackage, "Package Data ::", packageData);
                const result = yield this._packageRepository.editPackage(packageId, updatedPackage);
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
    deletePackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Package Delete in Service !');
                if (packageId) {
                    const response = yield this._packageRepository.deletePackage(packageId);
                    if (response)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
    findPackages(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._packageRepository.findPackages(searchParams);
                return response;
            }
            catch (err) {
                throw err;
            }
        });
    }
    findAgentPackages(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._packageRepository.findAgentPackages(searchParams);
                return response;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCategoryPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._packageRepository.getCategoryPackages();
            }
            catch (err) {
                throw err;
            }
        });
    }
    advanceSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._packageRepository.advanceSearch(query);
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyPackage(packageId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Admin Verify Package :', packageId);
                if (!packageId) {
                    throw new Error(`Package with ID ${packageId} not found`);
                }
                const result = yield this._packageRepository.updateOneById(packageId, {
                    isVerified: value
                });
                if (result) {
                    console.log("Result is ::", result);
                    return true;
                }
                return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.PackageService = PackageService;
exports.PackageService = PackageService = __decorate([
    __param(0, (0, inversify_1.inject)('IAdminRepository')),
    __param(1, (0, inversify_1.inject)("IPackageRepository")),
    __param(2, (0, inversify_1.inject)('INotificationService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], PackageService);
