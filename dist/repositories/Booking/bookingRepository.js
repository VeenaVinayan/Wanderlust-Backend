"use strict";
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
exports.BookingRepository = void 0;
const BaseRepository_1 = require("../Base/BaseRepository");
const Booking_1 = __importDefault(require("../../models/Booking"));
const mongoose_1 = __importDefault(require("mongoose"));
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const Package_1 = __importDefault(require("../../models/Package"));
class BookingRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Booking_1.default);
        this._bookingModel = Booking_1.default;
        this._walletModel = Wallet_1.default;
        this._packageModel = Package_1.default;
    }
    getBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, page, perPage, searchParams } = filterParams;
                const query = { userId: id };
                if (searchParams.search) {
                    query.$or = [
                        { bookingId: { $regex: searchParams.search, $options: 'i' } },
                        { email: { $regex: searchParams.search, $options: 'i' } }
                    ];
                }
                console.log("Query ::", searchParams);
                const [data, totalCount] = yield Promise.all([
                    this._bookingModel.find(query)
                        .sort({ bookingDate: -1 })
                        .populate({ path: 'packageId', select: 'name images price description day night itinerary' })
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .exec(),
                    this._bookingModel.countDocuments(query).exec()
                ]);
                return { data, totalCount };
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw new Error('Internal server error');
            }
        });
    }
    getPackageData(packageId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield this._bookingModel.findById(bookingId).populate('packageId').exec();
                if (!packageData) {
                    throw new Error('Package not found');
                }
                console.log("Package Data ::", packageData);
                const packageDetails = packageData.packageId;
                return packageData;
            }
            catch (error) {
                console.error('Error retrieving package data:', error);
                throw new Error('Internal server error');
            }
        });
    }
    getAgentBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('getAgent Data');
                const { id, page, perPage, searchParams } = filterParams;
                const data = yield this._bookingModel.aggregate([
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'packageId',
                            foreignField: '_id',
                            as: 'packageDetails',
                        },
                    },
                    { $unwind: '$packageDetails' },
                    {
                        $match: {
                            'packageDetails.agent': new mongoose_1.default.Types.ObjectId(id),
                        },
                    },
                    {
                        $group: {
                            _id: '$packageDetails.name',
                            packageName: { $first: '$packageDetails.name' },
                            totalBooking: { $sum: 1 },
                            bookings: {
                                $push: {
                                    _id: '$_id',
                                    packageName: '$packageDetails.name',
                                    packageImage: '$packageDetails.image[0]',
                                    packagePrice: '$packageDetails.price',
                                    bookingId: '$bookingId',
                                    bookingDate: '$bookingDate',
                                    userId: '$userId',
                                    tripDate: '$tripDate',
                                    packageId: '$packageId',
                                    email: '$email',
                                    phone: '$phone',
                                    tripStatus: '$tripStatus',
                                    totalGuest: '$totalGuest',
                                    totalAmount: '$totalAmout',
                                },
                            }
                        }
                    },
                    {
                        $facet: {
                            data: [
                                {
                                    $sort: {
                                        [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1,
                                    },
                                },
                                { $skip: (page - 1) * perPage },
                                { $limit: perPage },
                            ],
                            totalCount: [
                                { $count: 'count' }
                            ]
                        }
                    }
                ]);
                const resultData = data[0].data;
                const totalCount = ((_a = data[0].totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
                return { data: resultData, totalCount };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBookingDataToAdmin(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { page, perPage, searchParams } = filterParams;
                const skip = (page - 1) * perPage;
                console.log(' DAta value is ::', page, perPage, skip);
                const query = {};
                if (searchParams.search) {
                    query.$or = [
                        { bookingId: { $regex: searchParams.search, $options: 'i' } },
                        { email: { $regex: searchParams.search, $options: 'i' } }
                    ];
                }
                const result = yield this._bookingModel.aggregate([
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'packageId',
                            foreignField: '_id',
                            as: 'packages',
                        },
                    },
                    { $unwind: '$packages' },
                    { $match: query },
                    { $sort: { bookingDate: -1 } },
                    {
                        $facet: {
                            metadata: [
                                { $count: 'total' },
                                { $addFields: { page, perPage } },
                            ],
                            data: [
                                { $skip: skip },
                                { $limit: perPage },
                            ],
                        },
                    },
                ]);
                const data = result[0].data;
                const totalCount = ((_a = result[0].metadata[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                console.log("REsult :::", data, totalCount);
                return { data, totalCount };
            }
            catch (error) {
                console.error('Error retrieving booking data:', error);
                throw new Error('Internal server error');
            }
        });
    }
    creditToWallet(walletData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Credit to Wallet !!');
                const wallet = new Wallet_1.default(walletData);
                const result = yield wallet.save();
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get Wallet Data !!', userId);
                const wallet = yield this._walletModel.findOne({ userId });
                return wallet;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateWallet(userId, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Update Wallet !!');
                const updated = yield this._walletModel.updateOne({ userId }, {
                    $inc: { amount: amount },
                    $push: {
                        transaction: {
                            amount,
                            description
                        }
                    }
                }, { new: true });
                return updated;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getPackageBookingData(filterParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, page, perPage, searchParams } = filterParams;
                const query = { packageId: id };
                if (searchParams.search) {
                    query.$or = [
                        { bookingId: { $regex: searchParams.search, $options: 'i' } },
                        { email: { $regex: searchParams.search, $options: 'i' } },
                        { tripStatus: { $regex: searchParams.search, $options: 'i' } },
                    ];
                }
                const [data, totalCount] = yield Promise.all([
                    this._bookingModel.find(query)
                        .populate({ path: 'userId', select: 'name' })
                        .populate({ path: 'packageId', select: 'name images price' })
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .sort({ [searchParams.sortBy]: searchParams.sortOrder === 'asc' ? 1 : -1 })
                        .exec(),
                    this._bookingModel.countDocuments(query).exec()
                ]);
                return { data, totalCount };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getPackageDetails(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._packageModel.findOne({ _id: packageId });
                console.log('DAta ==', data);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._bookingModel.aggregate([
                    {
                        $match: { tripStatus: "Completed" }
                    },
                    {
                        $facet: {
                            summary: [
                                {
                                    $group: {
                                        _id: null,
                                        total: { $sum: "$totalAmount" },
                                        totalBooking: { $sum: 1 }
                                    }
                                },
                                {
                                    $set: {
                                        profit: { $multiply: ["$total", 0.1] }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        total: 1,
                                        totalBooking: 1,
                                        profit: 1
                                    }
                                }
                            ],
                            bookingsPerMonth: [
                                {
                                    $group: {
                                        _id: {
                                            year: { $year: "$createdAt" },
                                            month: { $month: "$createdAt" }
                                        },
                                        totalBookings: { $sum: 1 },
                                    }
                                },
                                {
                                    $sort: {
                                        "_id.year": 1,
                                        "_id.month": 1
                                    }
                                }
                            ]
                        }
                    }
                ]);
                console.log('DAta  dashboard = ', data[0]);
                return data.length > 0 ? data[0] : null;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBookingCompleteData(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._bookingModel.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) } },
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'packageId',
                            foreignField: '_id',
                            as: 'packageDetails'
                        }
                    },
                    { $unwind: '$packageDetails' },
                    {
                        $lookup: {
                            from: 'users',
                            let: { agentId: '$packageDetails.agent' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$_id', '$$agentId'] } } }
                            ],
                            as: 'agentDetails'
                        }
                    },
                    { $unwind: '$agentDetails' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userDetails'
                        }
                    },
                    { $unwind: '$userDetails' },
                    {
                        $project: {
                            _id: 0,
                            bookingId: 1,
                            bookingDate: 1,
                            tripDate: 1,
                            totalGuest: 1,
                            totalAmount: 1,
                            email: 1,
                            phone: 1,
                            'packageDetails.name': 1,
                            'agentDetails.name': 1,
                            'agentDetails.email': 1,
                            'agentDetails.phone': 1,
                            'userDetails.name': 1,
                            tripStatus: 1
                        }
                    }
                ]);
                console.log('Booking Data ::', data[0]);
                return data[0] || {};
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAgentData(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._bookingModel.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) } },
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'packageId',
                            foreignField: '_id',
                            as: 'packageDetails',
                        }
                    },
                    { $unwind: '$packageDetails' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userDetails',
                        }
                    },
                    { $unwind: '$userDetails' },
                    {
                        $project: {
                            packageName: '$packageDetails.name',
                            userName: '$userDetails.name',
                            agentId: '$packageDetails.agent',
                        }
                    }
                ]).exec();
                console.log("Data value = ", data[0]);
                return data.length > 0 ? { packageName: data[0].packageName, userName: data[0].userName, agentId: data[0].agentId } : null;
            }
            catch (err) {
                throw err;
            }
        });
    }
    validateBooking(packageId, tripDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(tripDate);
                startDate.setDate(startDate.getDate() - 5);
                const endDate = new Date(tripDate);
                endDate.setDate(endDate.getDate() + 30);
                const packageValue = yield this._packageModel.findOne({ _id: packageId }, { totalCapacity: 1 }).lean();
                const data = yield this._bookingModel.aggregate([
                    {
                        $match: {
                            packageId: packageId,
                            tripDate: { $gte: startDate, $lt: endDate },
                            status: { $in: ["Pending", "Confirmed", "In-Progress"] }
                        }
                    },
                    {
                        $group: {
                            _id: "$tripDate",
                            bookingCount: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id",
                            bookingCount: 1
                        }
                    }
                ]);
                const targetDateString = new Date(tripDate).toDateString();
                const matchedDay = data.find((d) => new Date(d.date).toDateString() === targetDateString);
                const resultData = {
                    tripDate: matchedDay || { date: tripDate, bookingCount: 0 },
                    totalCapacity: (packageValue === null || packageValue === void 0 ? void 0 : packageValue.totalCapacity) || 0
                };
                return resultData;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.BookingRepository = BookingRepository;
