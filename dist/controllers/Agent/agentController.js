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
exports.AgentController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const s3Service_1 = require("../../config/s3Service");
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
;
const StatusMessage_1 = require("../../enums/StatusMessage");
let AgentController = class AgentController {
    constructor(_agentService) {
        this._agentService = _agentService;
        this.getPresignedUrl = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { fileType } = req.body;
            if (!fileType) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                    .json({ message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD });
                return;
            }
            try {
                const response = yield s3Service_1.s3Service.generateSignedUrl(fileType);
                res.status(200).json({ response });
            }
            catch (error) {
                next(error);
            }
        }));
        this.uploadCertificate = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { publicUrl } = req.body;
            if (!id || !publicUrl) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                    .json({ message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD });
                return;
            }
            const response = yield this._agentService.uploadCertificate(id, publicUrl);
            if (response) {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            else {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.ERROR });
            }
        }));
        this.getCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this._agentService.getCategories();
            if (data) {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, categories: data });
            }
            else {
                res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ success: false, message: StatusMessage_1.StatusMessage.ERROR });
            }
        }));
        this.getSignedUrls = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { fileTypes } = req.body;
            if (!fileTypes) {
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: "File types are required !" });
                return;
            }
            try {
                const data = yield s3Service_1.s3Service.generateSignedUrls(fileTypes);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST, data });
            }
            catch (err) {
                next(err);
            }
        }));
        this.deleteImages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteImages = req.body;
                yield s3Service_1.s3Service.deleteImages(deleteImages);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            catch (err) {
                next(err);
            }
        }));
        this.getDashboardData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { agentId } = req.params;
                const data = yield this._agentService.getDashboardData(agentId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                next(err);
            }
        }));
    }
};
exports.AgentController = AgentController;
exports.AgentController = AgentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgentService')),
    __metadata("design:paramtypes", [Object])
], AgentController);
