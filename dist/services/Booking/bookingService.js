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
                const bookingValue = yield this._bookingRepository.getBookingCompleteData(bookingData._id);
                if (!bookingValue) {
                    throw new Error("Package not found");
                }
                //  const outputPath = path.join(__dirname, '../../', 'itinerary.pdf');
                // const itineraryPdf = generateItineraryPDF(packageData,outputPath);
                {
                    const { email, body, title } = emailHelper_1.default.generateBookingEmailBody(bookingValue);
                    yield (0, mailSender_1.default)(email, title, body);
                    console.log("Email sent successfully");
                }
                {
                    const { email, body, title } = emailHelper_1.default.generateBookingNotificationToAgent(bookingValue);
                    console.log('Email to agent ::', email);
                    yield (0, mailSender_1.default)(email, title, body);
                    console.log("Agent Email sent successfully");
                }
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
    updateBookingStatusByAgent(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Attempting to update booking status by agent:', status);
                const bookingData = yield this._bookingRepository.findOneById(bookingId);
                if (!bookingData) {
                    console.log(' No booking data found.');
                    throw new Error('Booking not found');
                }
                if (bookingData.tripStatus === status) {
                    throw new Error(`Booking is already marked as ${status}`);
                }
                const now = new Date();
                const tripDate = new Date(bookingData.tripDate);
                if (status === 'Completed' && tripDate > now) {
                    throw new Error('Trip has not yet occurred. Cannot mark as Completed.');
                }
                if (status === 'Cancelled' && bookingData.tripStatus === 'Completed') {
                    throw new Error('Completed trips cannot be cancelled.');
                }
                // Perform the status update
                const updatedBooking = yield this._bookingRepository.updateOneById(bookingId, {
                    tripStatus: status,
                    paymentStatus: status === 'Cancelled' ? 'Refunded' : bookingData.paymentStatus,
                });
                console.log('✅ Booking updated:', updatedBooking);
                if (updatedBooking && status === 'Cancelled') {
                    const walletData = {
                        userId: bookingData.userId,
                        amount: bookingData.totalAmount,
                        transaction: {
                            amount: bookingData.totalAmount,
                            description: 'Booking cancelled by agent — amount refunded',
                        }
                    };
                    const refundResult = yield this.addToWallet(walletData);
                    if (!refundResult) {
                        console.error('⚠️ Wallet refund failed');
                        throw new Error('Booking was cancelled, but refund failed');
                    }
                    console.log(' Wallet refund successful');
                    {
                        const bookingData = yield this._bookingRepository.getBookingCompleteData(bookingId);
                        const { email, body, title } = emailHelper_1.default.generateBookingEmailBody(bookingData);
                        yield (0, mailSender_1.default)(email, title, body);
                    }
                }
                return updatedBooking;
            }
            catch (error) {
                console.error('  Error updating booking status:');
                throw error;
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
            var _a, _b;
            try {
                // Explicitly type the data to match the expected structure
                const data = yield this._bookingRepository.getDashboard();
                if (!data)
                    return null;
                const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                (_a = data.bookingsPerMonth) === null || _a === void 0 ? void 0 : _a.forEach(item => {
                    console.log("Month:", item._id.month, "=>", MONTHS[item._id.month - 1]);
                });
                console.log('Data in Booking Service ::', JSON.stringify(data));
                const chartData = (_b = data.bookingsPerMonth) === null || _b === void 0 ? void 0 : _b.map((item) => ({
                    month: MONTHS[item._id.month - 1],
                    totalBookings: item.totalBookings,
                }));
                const dashboardData = {
                    summary: data === null || data === void 0 ? void 0 : data.summary[0],
                    bookingsPerMonth: chartData && chartData.length > 0
                        ? [chartData[0]]
                        : [{ totalBookings: 0, month: '' }],
                };
                console.log('Dashboard Data ::', dashboardData);
                return dashboardData;
            }
            catch (err) {
                throw err;
            }
        });
    }
    addToWallet(walletData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adding to wallet:", walletData);
                const wallet = yield this._bookingRepository.getWallet(walletData.userId);
                console.log("Wallet found ::", wallet);
                if (!wallet) {
                    const result = yield this._bookingRepository.creditToWallet(walletData);
                    console.log("Result ::", wallet);
                    return !!result;
                }
                else {
                    const result = yield this._bookingRepository.updateWallet(walletData.userId, walletData.amount, walletData.transaction.description);
                    console.log("Result ::-else", wallet);
                    return !!result;
                }
            }
            catch (error) {
                console.error('Error adding to wallet:', error);
                throw new Error('Internal server error');
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
function sendConfirmationToAgent(bookingData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Inside Booking Service - sendConfirmationToAgent", bookingData);
            const bookingDetails = emailHelper_1.default.generateBookingNotificationToAgent(bookingData._id);
        }
        catch (err) {
            throw err;
        }
    });
}
