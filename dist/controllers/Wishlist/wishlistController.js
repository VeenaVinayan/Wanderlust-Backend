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
exports.WishlistController = void 0;
const inversify_1 = require("inversify");
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
;
const StatusMessage_1 = require("../../enums/StatusMessage");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
let WishlistController = class WishlistController {
    constructor(_wishlistService) {
        this._wishlistService = _wishlistService;
        this.addToWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, packageId } = req.body;
                console.log('Add to wish list !!');
                const result = yield this._wishlistService.isExistWishlist(userId, packageId);
                if (!result) {
                    const data = yield this._wishlistService.addToWishlist(userId, packageId);
                    if (data) {
                        res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                    }
                    else {
                        res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ messgae: StatusMessage_1.StatusMessage.NOT_FOUND });
                    }
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.CONFLICT).json({ message: StatusMessage_1.StatusMessage.CONFLICT });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                console.log('Get Wishlist controller !!');
                const result = yield this._wishlistService.getWishlist(String(userId));
                if (result)
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data: result });
                else
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ success: false });
            }
            catch (err) {
                throw err;
            }
        }));
        this.deleteWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                console.log('Delete Wishlist !! ');
                const result = yield this._wishlistService.deleteWishlist(String(id));
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.DELETED });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                throw err;
            }
        }));
    }
};
exports.WishlistController = WishlistController;
exports.WishlistController = WishlistController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IWishlistService')),
    __metadata("design:paramtypes", [Object])
], WishlistController);
