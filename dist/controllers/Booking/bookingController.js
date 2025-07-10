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
exports.BookingController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
let BookingController = class BookingController {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
        this.bookPackage = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //const resultValue = await this._bookingService.validateBooking(req.body);
                console.log("Booking Data ::", req.body);
                const result = yield this._bookingService.bookPackage(req.body);
                if (result) {
                    yield this._bookingService.sendConfirmationEmail(result);
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', result });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
                }
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw error;
            }
        }));
        this.getBookingData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Get Booking Data ", req.query);
                const { id } = req.params;
                const { page, perPage, search, sortBy, sortOrder } = req.query;
                const filterParams = {
                    id,
                    page: Number(page),
                    perPage: Number(perPage),
                    searchParams: {
                        search: search || '',
                        sortBy: sortBy || 'bookingDate',
                        sortOrder: sortOrder || 'dec',
                    }
                };
                const data = yield this._bookingService.getBookingData(filterParams);
                console.log("Booking Data ::", data);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: 'Booking data retrieved successfully', data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'No booking data found' });
                }
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw error;
            }
        }));
        this.getAgentBookingData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Agent  Booking Data !');
                const { id } = req.params;
                const filterParams = {
                    id,
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || '',
                        sortBy: req.query.sortBy || 'tripDate',
                        sortOrder: req.query.sortOrder || 'asc',
                    }
                };
                const data = yield this._bookingService.getAgentBookingData(filterParams);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, data });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.updateBookingStatusByAgent = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Update Booking Status by Agent !!');
                const { bookingId } = req.params;
                const { status } = req.body;
                if (!bookingId || !status) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD });
                    return;
                }
                const response = yield this._bookingService.updateBookingStatusByAgent(bookingId, status);
                if (response) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: 'Successfully updated status' });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'Not successfully updated!' });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getBookingDataToAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filterParams = {
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || '',
                        sortBy: req.query.sortBy || 'tripDate',
                        sortOrder: req.query.sortOrder || 'asc',
                    }
                };
                const data = yield this._bookingService.getBookingDataToAdmin(filterParams);
                console.log("Booking Data is ::", data);
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ success: true, data });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.cancelBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const result = yield this._bookingService.cancelBooking(String(bookingId));
                if (result) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.CONFLICT).json({ success: false, message: StatusMessage_1.StatusMessage.CANCEL_BOOKING });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.getPackageBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                const { page, perPage, searchParams } = req.query;
                console.log('Get packages : ,packagId, searchParams', packageId, searchParams);
                const filterParams = {
                    id: packageId,
                    page: Number(page),
                    perPage: Number(perPage),
                    searchParams: {
                        search: searchParams || '',
                        sortBy: 'tripDate',
                        sortOrder: req.query.sortOrder || 'asc',
                    }
                };
                const data = yield this._bookingService.getPackageBookingData(filterParams);
                console.log("Package Data is :: ", data);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
            }
            catch (err) {
                throw err;
            }
        }));
        this.getDashboard = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._bookingService.getDashboard();
                if (data) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ data });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ data });
                }
            }
            catch (err) {
                throw err;
            }
        }));
        this.validateBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId, day } = req.query;
                if (!packageId || !day) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false });
                    return;
                }
                const data = yield this._bookingService.validateBooking(String(packageId), new Date(String(day)));
                console.log("Validation Data ::", JSON.stringify(data === null || data === void 0 ? void 0 : data.tripDate));
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
                console.log('Validate Booking ', req.body);
            }
            catch (err) {
                throw err;
            }
        }));
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IBookingService')),
    __metadata("design:paramtypes", [Object])
], BookingController);
