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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
const s3Service_1 = require("../../config/s3Service");
let AdminController = class AdminController {
    constructor(_adminService // _add
    ) {
        this._adminService = _adminService;
        this.getAllData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.info('Get all users !');
            try {
                const { user, perPage, page } = req.params;
                //const { search, sortBy, sortOrder} = req.query;
                const search = req.query.search || '';
                const sortBy = req.query.sortBy || 'name';
                const sortOrder = req.query.sortOrder || 'asc';
                const users = yield this._adminService.getAllData(user, parseInt(perPage), parseInt(page), search, sortBy, sortOrder);
                console.log("Users:: ", users);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS, users });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error !" });
            }
        }));
        this.blockOrUnblock = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.info("Block or unblock User in Controller !", req.body);
            try {
                const { id, role } = req.body;
                const response = yield this._adminService.blockOrUnblock(id);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getPresignedUrl = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { fileType } = req.body;
            console.log('Get presigned url ::', fileType);
            if (!fileType) {
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: "File types are required !" });
                return;
            }
            try {
                const response = yield s3Service_1.s3Service.generateSignedUrl(fileType);
                console.log('After presigned urls ::', response);
                res.status(200).json({ response });
            }
            catch (error) {
                console.error('Error generating signed Urls:', error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.addCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(' Add category !!', req.body);
                const response = yield this._adminService.addCategory(req.body);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.ACCEPTED).json({ message: StatusMessage_1.StatusMessage.CREATED });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { perPage, page } = req.params;
                const search = req.query.search || '';
                const sortBy = req.query.sortBy || 'name';
                const sortOrder = req.query.sortOrder || 'asc';
                const data = yield this._adminService.getCategories(Number(perPage), Number(page), search, sortBy, sortOrder);
                console.log(" Categories ::", data);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                console.log('Error in get category !');
                throw err;
            }
        }));
        this.deleteCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Delete category in Controller !!');
                const { categoryId } = req.params;
                const response = yield this._adminService.deleteCategory(categoryId);
                console.log(" Result :: ", response);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false });
                }
            }
            catch (err) {
                console.log("Error in  Delete Category !! Controller !!", err);
                throw err;
            }
        }));
        this.isCategoryExist = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName } = req.params;
                const response = yield this._adminService.isExistCategory(categoryName);
                if (!response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.CONFLICT).json({ success: false });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.editCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const category = req.body;
                const response = yield this._adminService.editCategory(categoryId, category);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                console.log("Error in Edit Cateory Controler ||");
                throw err;
            }
        }));
        this.pendingAgentData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { perPage, page } = req.params;
                const agentData = yield this._adminService.getPendingAgentData(Number(perPage), Number(page));
                console.log("Agent Data :", agentData);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, agentData });
            }
            catch (err) {
                console.log('Error in Fetch Pending Agent Data !');
                throw err;
            }
        }));
        this.agentApproval = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { agentId } = req.params;
                const result = yield this._adminService.agentApproval(agentId);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.rejectAgentRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { agentId } = req.params;
                const result = yield this._adminService.rejectAgentRequest(agentId);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.blockPackage = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(" Block Package ! by Admin");
                const { packageId } = req.params;
                const result = yield this._adminService.blockPackage(packageId);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                throw err;
            }
        }));
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAdminService')),
    __metadata("design:paramtypes", [Object])
], AdminController);
