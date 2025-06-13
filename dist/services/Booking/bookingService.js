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
exports.BookingService = void 0;
const inversify_1 = require("inversify");
const mailSender_1 = __importDefault(require("../../utils/mailSender"));
const emailHelper_1 = __importDefault(require("../../helper/emailHelper"));
const date_fns_1 = require("date-fns");
let BookingService = class BookingService {
    constructor(_notificationRepository, _bookingRepository) {
        this._notificationRepository = _notificationRepository;
        this._bookingRepository = _bookingRepository;
    }
    bookPackage(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inside Booking Service - bookPackage", bookingData);
                return yield this._bookingRepository.createNewData(bookingData);
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw new Error('Internal server error');
            }
        });
    }
    getBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inside Booking Service - getBookingData", filterParams);
                return yield this._bookingRepository.getBookingData(filterParams);
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw new Error('Internal server error');
            }
        });
    }
    sendConfirmationEmail(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inside Booking Service - sendConformationEmail", bookingData);
                const packageData = yield this._bookingRepository.getPackageData(bookingData.packageId, bookingData._id);
                if (!packageData) {
                    throw new Error("Package not found");
                }
                //  const outputPath = path.join(__dirname, '../../', 'itinerary.pdf');
                // const itineraryPdf = generateItineraryPDF(packageData,outputPath);
                const { email, body, title } = emailHelper_1.default.generateBookingEmailBody(bookingData);
                const result = yield (0, mailSender_1.default)(email, title, body);
                console.log("Email sent successfully", result);
            }
            catch (err) {
                console.log("Error in sending email", err);
                throw err;
            }
        });
    }
    getAgentBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Agent Booking Data !!');
                const data = yield this._bookingRepository.getAgentBookingData(filterParams);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateBookingStatusByAgent(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Update Booking Status by Agent !!');
                const data = yield this._bookingRepository.updateOneById(bookingId, { tripStatus: 'Completed' });
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBookingDataToAdmin(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Booking Data !!');
                const data = yield this._bookingRepository.getBookingDataToAdmin(filterParams);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    cancelBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Cancel Booking in service !!', id);
                const bookingData = yield this._bookingRepository.findOneById(id);
                if (!bookingData) {
                    console.log('Not booking Data !!');
                    return false;
                }
                if (bookingData.tripStatus !== 'Cancelled') {
                    const today = new Date();
                    const bookingDate = new Date(bookingData.tripDate);
                    const day = (0, date_fns_1.differenceInDays)(bookingDate, today);
                    if (day >= 4) {
                        const cancellationFee = (bookingData === null || bookingData === void 0 ? void 0 : bookingData.totalAmount) * .2;
                        const amount = Math.floor(bookingData.totalAmount * .8);
                        const result = yield this._bookingRepository.updateOneById(id, { tripStatus: "Cancelled", paymentStatus: "Refunded" });
                        const wallet = yield this._bookingRepository.getWallet(bookingData.userId);
                        console.log('Value in Cancel Booking ::', result, wallet, amount, cancellationFee);
                        if (!wallet) {
                            const walletData = {
                                userId: bookingData.userId,
                                amount: amount,
                                transaction: {
                                    amount,
                                    description: 'Cancellation balance payment credited'
                                }
                            };
                            const resultWallet = yield this._bookingRepository.creditToWallet(walletData);
                            console.log('Values in Wallet ::', resultWallet);
                        }
                        else {
                            const updateResult = yield this._bookingRepository.updateWallet(bookingData.userId, amount, 'Cancellation Balance payment credited !');
                            console.log('Values in Wallet ::', updateResult);
                        }
                        // const notification = {
                        //      userId :new mongoose.Schema.Types.ObjectId(bookingData.userId),
                        //      message:`$id is cancelled by User`,
                        //      type:'Booking'
                        // }
                        // const res = await this._notificationRepository.createNewData(notification);
                        // if(res){
                        //     emitNotification(bookingData.userId.toString(), {
                        //     message: "Your booking has been canceled and refund is processed.",
                        //     type: "booking"
                        // });
                    }
                    else {
                        return false;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    getPackageBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._bookingRepository.getPackageBookingData(filterParams);
            }
            catch (err) {
                throw err;
            }
        });
    }
    validateBooking(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._bookingRepository.getPackageDetails(bookingData.packageId);
                if (data) {
                    console.log('DAta is ...', data);
                    return true;
                }
                else
                    return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._bookingRepository.getDashboard();
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('INotificationRepository')),
    __param(1, (0, inversify_1.inject)('IBookingRepository')),
    __metadata("design:paramtypes", [Object, Object])
], BookingService);
