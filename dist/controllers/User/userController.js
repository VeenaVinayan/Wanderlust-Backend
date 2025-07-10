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
exports.UserController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
const stripePayment_1 = __importDefault(require("../../config/stripePayment"));
let UserController = class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.updateProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('UPdate User profile !!');
                const { name, phone } = req.body;
                const userId = req.params.id;
                console.log("User id is ", userId);
                const data = yield this._userService.updateUser(userId, name, phone);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Reset password !!');
                const response = yield this._userService.resetPassword(req);
                switch (response) {
                    case 1:
                        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ error: true, message: StatusMessage_1.StatusMessage.OLD_PASSWORD_INCORRECT });
                        return;
                    case 2:
                        res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.PASSWORD_RESET_SUCCESS });
                        return;
                    case 3:
                        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ error: true, message: StatusMessage_1.StatusMessage.PASSWORD_MISMATCH });
                        return;
                    case 4:
                        res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ error: true, message: StatusMessage_1.StatusMessage.USER_NOT_FOUND });
                        return;
                    default:
                        res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ error: true, message: StatusMessage_1.StatusMessage.PASSWORD_RESET_SUCCESS });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._userService.getCategories();
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                console.log("Error in Get Categories !!", err);
                throw err;
            }
        }));
        this.getPackages = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._userService.getPackages();
                console.log('Packages in User Controller !!!', data);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ message: StatusMessage_1.StatusMessage.ERROR, data });
                }
            }
            catch (err) {
                console.log('Error in Get Packages !!');
                throw err;
            }
        }));
        this.stripePayment = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { price, packageName } = req.body;
                console.log("Booking Data ::", req.body);
                const data = yield stripePayment_1.default.createCheckoutSession({ price, packageName });
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ message: StatusMessage_1.StatusMessage.ERROR, data });
                }
            }
            catch (err) {
                console.log('Error in Stripe Payment !!');
                throw err;
            }
        }));
        this.addReview = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewData } = req.body;
                console.log('Values in add Review ::', reviewData);
                const result = yield this._userService.addReview(reviewData);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getReview = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Review controller !!');
                const { userId, packageId } = req.query;
                const review = yield this._userService.getReview(String(userId), String(packageId));
                if (review) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ succes: true, data: review });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NO_CONTENT).json({ success: true });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.deleteReview = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.query;
                console.log('Delete REview !!', reviewId);
                if (!reviewId) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                }
                const result = yield this._userService.deleteReview(String(reviewId));
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getReviews = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                console.log('DAta in get Reviews ::', packageId);
                if (!packageId) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ error: true, message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const data = yield this._userService.getReviews(packageId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                throw err;
            }
        }));
        this.getWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { page, perPage, search, sortBy, sortOrder } = req.query;
                const filterParams = {
                    id: userId,
                    page: Number(page),
                    perPage: Number(perPage),
                    searchParams: {
                        search: search || '',
                        sortBy: 'description',
                        sortOrder: sortOrder || '',
                    }
                };
                if (!userId) {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNPROCESSABLE_ENTITY).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const data = yield this._userService.getWallet(userId, filterParams);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
            }
            catch (err) {
                throw err;
            }
        }));
        this.editReview = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { review, rating } = req.body;
                const { reviewId } = req.params;
                console.log('Data in edit Review ::', review, rating, reviewId);
                if (!reviewId || !review || !rating) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ error: true, message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const result = yield this._userService.editReview({ review, rating }, reviewId);
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.UPDATE_SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.UPDATE_FAILED });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const data = yield this._userService.userDetails(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, data });
            }
            catch (err) {
                throw err;
            }
        }));
    }
    userProfile() {
        console.log('UserProfile !');
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserService')),
    __metadata("design:paramtypes", [Object])
], UserController);
