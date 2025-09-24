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
const PasswordReset_1 = require("../../enums/PasswordReset");
let BookingController = class BookingController {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
        this.bookPackage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._bookingService.bookPackage(req.body);
                if (result) {
                    yield this._bookingService.sendConfirmationEmail(result);
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.OK)
                        .json({
                        success: true,
                        message: "Booking data retrieved successfully",
                        result,
                    });
                }
                else {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ success: false, message: "No booking data found" });
                }
            }
            catch (error) {
                next(error);
            }
        }));
        this.getBookingData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { page, perPage, search, sortBy, sortOrder } = req.query;
                const filterParams = {
                    id,
                    page: Number(page),
                    perPage: Number(perPage),
                    searchParams: {
                        search: search || "",
                        sortBy: sortBy || "bookingDate",
                        sortOrder: sortOrder || "dec",
                    },
                };
                const bookings = yield this._bookingService.getBookingData(filterParams);
                if (bookings) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.OK)
                        .json({
                        success: true,
                        message: "Booking data retrieved successfully",
                        bookings,
                    });
                }
                else {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ success: false, message: "No booking data found" });
                }
            }
            catch (error) {
                next(error);
            }
        }));
        this.getAgentBookingData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const filterParams = {
                    id,
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || "",
                        sortBy: req.query.sortBy || "tripDate",
                        sortOrder: req.query.sortOrder || "asc",
                    },
                };
                const bookings = yield this._bookingService.getAgentBookingData(filterParams);
                if (bookings) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, bookings });
                }
                else {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ success: false, message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.updateBookingStatusByAgent = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { status } = req.body;
                if (!bookingId || !status) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json({
                        success: false,
                        message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD,
                    });
                    return;
                }
                const response = yield this._bookingService.updateBookingStatusByAgent(bookingId, status);
                if (response) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.OK)
                        .json({ success: true, message: "Successfully updated status" });
                }
                else {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ success: false, message: "Not successfully updated!" });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.getBookingDataToAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filterParams = {
                    page: Number(req.query.page),
                    perPage: Number(req.query.perPage),
                    searchParams: {
                        search: req.query.search || "",
                        sortBy: req.query.sortBy || "tripDate",
                        sortOrder: req.query.sortOrder || "asc",
                    },
                };
                const bookings = yield this._bookingService.getBookingDataToAdmin(filterParams);
                if (bookings) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, bookings });
                }
                else {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ success: false, message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.cancelBooking = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const result = yield this._bookingService.cancelBooking(String(bookingId));
                switch (result) {
                    case PasswordReset_1.CancellBookingResult.SUCCESS:
                        res
                            .status(HttpStatusCode_1.HttpStatusCode.OK)
                            .json({ success: true, message: StatusMessage_1.StatusMessage.SUCCESS });
                        return;
                    case PasswordReset_1.CancellBookingResult.CONFLICT:
                        res
                            .status(HttpStatusCode_1.HttpStatusCode.CONFLICT)
                            .json({
                            success: false,
                            message: StatusMessage_1.StatusMessage.MISSING_REQUIRED_FIELD,
                        });
                        return;
                    case PasswordReset_1.CancellBookingResult.EXCEEDED_CANCELLATION_LIMIT:
                        res
                            .status(HttpStatusCode_1.HttpStatusCode.CONFLICT)
                            .json({
                            success: false,
                            message: StatusMessage_1.StatusMessage.EXCEEDED_CANCELLATION_LIMIT,
                        });
                        return;
                    case PasswordReset_1.CancellBookingResult.ALREADY_CANCELLED:
                        res
                            .status(HttpStatusCode_1.HttpStatusCode.CONFLICT)
                            .json({
                            success: false,
                            message: StatusMessage_1.StatusMessage.ALREADY_CANCELLED,
                        });
                        return;
                    default:
                        res
                            .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                            .json({ success: false, message: StatusMessage_1.StatusMessage.NOT_FOUND });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.getPackageBooking = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId } = req.params;
                const { page, perPage, searchParams } = req.query;
                const filterParams = {
                    id: packageId,
                    page: Number(page),
                    perPage: Number(perPage),
                    searchParams: {
                        search: searchParams || "",
                        sortBy: "tripDate",
                        sortOrder: req.query.sortOrder || "dec",
                    },
                };
                const data = yield this._bookingService.getPackageBookingData(filterParams);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
            }
            catch (err) {
                next(err);
            }
        }));
        this.getDashboard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboard = yield this._bookingService.getDashboard();
                if (dashboard) {
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ dashboard });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.ERROR });
                }
            }
            catch (err) {
                next(err);
            }
        }));
        this.validateBooking = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageId, day } = req.query;
                if (!packageId || !day) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false });
                    return;
                }
                const values = yield this._bookingService.validateBooking(String(packageId), new Date(String(day)));
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, values });
            }
            catch (err) {
                next(err);
            }
        }));
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IBookingService")),
    __metadata("design:paramtypes", [Object])
], BookingController);
