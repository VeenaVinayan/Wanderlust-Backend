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
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
let ChatController = class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
        this.getAllUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const users = yield this._chatService.getAllUsers(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ users });
            }
            catch (err) {
                next(err);
            }
        }));
        this.getMessages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { sender, receiver } = req.query;
                if (!sender || !receiver) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const messages = yield this._chatService.getMessages(String(sender), String(receiver));
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ messages });
            }
            catch (err) {
                next(err);
            }
        }));
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IChatService")),
    __metadata("design:paramtypes", [Object])
], ChatController);
