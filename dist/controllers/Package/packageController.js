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
exports.PackageController = void 0;
const inversify_1 = require("inversify");
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const packageMapper_1 = __importDefault(require("../../mapper/packageMapper"));
let PackageController = class PackageController {
    constructor(_packageService) {
        this._packageService = _packageService;
        this.addPackage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._packageService.addPackage(req.body);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(StatusMessage_1.StatusMessage.CREATED);
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).jsonp(StatusMessage_1.StatusMessage.ERROR);
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.editPackage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                const packageData = req.body;
                const result = yield this._packageService.editPackage(packageId, packageData);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.deletePackage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                const response = yield this._packageService.deletePackage(packageId);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.getPackages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filterParams = {
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || '',
                        sortBy: req.query.sortBy || 'createdAt',
                        sortOrder: req.query.sortOrder || 'des',
                    }
                };
                const result = yield this._packageService.findPackages(filterParams);
                const packages = packageMapper_1.default.userPackageData(result.packages);
                const data = {
                    packages: packages,
                    totalCount: result.totalCount,
                };
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                next(err);
            }
        }));
        this.getAgentPackages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const filterParams = {
                    id,
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || '',
                        sortBy: req.query.sortBy || 'name',
                        sortOrder: req.query.sortOrder || 'asc',
                    }
                };
                const packages = yield this._packageService.findAgentPackages(filterParams);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data: packages });
            }
            catch (err) {
                next(err);
            }
        }));
        this.getCategoryPackages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield this._packageService.getCategoryPackages();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ packages });
            }
            catch (err) {
                next(err);
            }
        }));
        this.advanceSearch = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Advance Search ::', req.query);
                const result = yield this._packageService.advanceSearch(req.query);
                const packages = packageMapper_1.default.userPackageData(result.packages);
                const data = {
                    packages: packages,
                    totalPackages: result.totalCount,
                };
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                next(err);
            }
        }));
        this.verifyPackage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                const { value } = req.body;
                const response = yield this._packageService.verifyPackage(packageId, value);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                next(err);
            }
        }));
    }
};
exports.PackageController = PackageController;
exports.PackageController = PackageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IPackageService')),
    __metadata("design:paramtypes", [Object])
], PackageController);
