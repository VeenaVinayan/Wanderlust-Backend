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
exports.AgentRepository = void 0;
const Agent_1 = __importDefault(require("../../models/Agent"));
const BaseRepository_1 = require("../Base/BaseRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const Category_1 = __importDefault(require("../../models/Category"));
class AgentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Agent_1.default);
        this._agentModel = Agent_1.default;
        this._categoryModel = Category_1.default;
    }
    uploadCertificate(id, certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(" Agent reposiory for upload certificate !!");
                return yield Agent_1.default.updateOne({ userId: id }, {
                    $set: { license: certificate, isVerified: 'Uploaded' }
                });
            }
            catch (err) {
                console.log("Error in upload photo !");
                throw err;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._categoryModel.find({ status: true }, { _id: 1, name: 1 });
            }
            catch (err) {
                console.log(' Error in Fetch Category !!');
                throw err;
            }
        });
    }
    getDashboardData(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._agentModel.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(agentId) },
                    },
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'userId',
                            foreignField: 'agent',
                            as: 'packages',
                        },
                    },
                    { $unwind: { path: '$packages', preserveNullAndEmptyArrays: false } },
                    {
                        $lookup: {
                            from: 'bookings',
                            let: { packageId: '$packages._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$packageId', '$$packageId'] },
                                                { $eq: ['$tripStatus', 'Completed'] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: 'completedBookings',
                        },
                    },
                    {
                        $lookup: {
                            from: 'bookings',
                            let: { packageId: '$packages._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$packageId', '$$packageId'] },
                                                { $eq: ['$tripStatus', 'Cancelled'] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: 'cancelledBookings',
                        },
                    },
                    {
                        $facet: {
                            totalPackages: [
                                {
                                    $group: {
                                        _id: null,
                                        packageIds: { $addToSet: '$packages._id' },
                                    },
                                },
                                {
                                    $project: {
                                        totalPackages: { $size: '$packageIds' },
                                    },
                                },
                            ],
                            totalClients: [
                                { $unwind: '$completedBookings' },
                                {
                                    $group: {
                                        _id: null,
                                        clients: { $addToSet: '$completedBookings.userId' },
                                    },
                                },
                                {
                                    $project: {
                                        totalClients: { $size: '$clients' },
                                    },
                                },
                            ],
                            totalBookingStats: [
                                { $unwind: '$completedBookings' },
                                {
                                    $group: {
                                        _id: null,
                                        totalCompletedBookings: { $sum: 1 },
                                        totalAmount: { $sum: '$completedBookings.totalAmount' },
                                    },
                                },
                            ],
                            cancelledBookingStats: [
                                { $unwind: '$cancelledBookings' },
                                {
                                    $group: {
                                        _id: null,
                                        totalCancelledBookings: { $sum: 1 },
                                    },
                                },
                            ],
                            bookingsPerMonth: [
                                { $unwind: '$completedBookings' },
                                {
                                    $group: {
                                        _id: { month: { $month: '$completedBookings.bookingDate' } },
                                        totalBookings: { $sum: 1 },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        month: '$_id.month',
                                        totalBookings: 1,
                                    },
                                },
                                { $sort: { month: 1 } },
                            ],
                            packageBookingCounts: [
                                { $unwind: '$completedBookings' },
                                {
                                    $group: {
                                        _id: '$packages._id',
                                        packageName: { $first: '$packages.name' },
                                        value: { $sum: 1 },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        packageName: 1,
                                        value: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            totalPackages: { $arrayElemAt: ['$totalPackages.totalPackages', 0] },
                            totalClients: { $arrayElemAt: ['$totalClients.totalClients', 0] },
                            totalBookings: { $arrayElemAt: ['$totalBookingStats.totalCompletedBookings', 0] },
                            totalAmount: { $arrayElemAt: ['$totalBookingStats.totalAmount', 0] },
                            totalCancelledBookings: {
                                $ifNull: [
                                    { $arrayElemAt: ['$cancelledBookingStats.totalCancelledBookings', 0] },
                                    0,
                                ],
                            },
                            bookingsPerMonth: 1,
                            packageBookingCounts: 1,
                        },
                    },
                ]);
                console.log('Dashboard Data ::', data[0]);
                return (data[0] || {
                    totalBookings: 0,
                    totalAmount: 0,
                    totalPackages: 0,
                    totalClients: 0,
                    totalCancelledBookings: 0,
                    bookingsPerMonth: [],
                    packageBookingCounts: [],
                });
            }
            catch (err) {
                console.error('Dashboard Data Error:', err);
                throw new Error('Failed to fetch dashboard data');
            }
        });
    }
}
exports.AgentRepository = AgentRepository;
