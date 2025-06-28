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
                const objectId = new mongoose_1.default.Types.ObjectId(agentId);
                const data = yield this._agentModel.aggregate([
                    {
                        $match: { userId: objectId },
                    },
                    {
                        $lookup: {
                            from: 'packages',
                            localField: 'userId', // Assuming 'userId' is used in packages to refer to agent
                            foreignField: 'userId',
                            as: 'packageDetails',
                        },
                    },
                    {
                        $unwind: {
                            path: '$packageDetails',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'bookings',
                            localField: 'packageDetails._id',
                            foreignField: 'packageId',
                            as: 'bookings',
                        },
                    },
                    {
                        $unwind: {
                            path: '$bookings',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $addFields: {
                            bookingMonth: {
                                $dateToString: {
                                    format: '%Y-%m',
                                    date: '$bookings.bookingDate',
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalBookings: { $sum: { $cond: [{ $ifNull: ['$bookings._id', false] }, 1, 0] } },
                            totalAmount: { $sum: { $ifNull: ['$bookings.totalAmount', 0] } },
                            bookingsPerMonth: {
                                $push: {
                                    month: '$bookingMonth',
                                },
                            },
                            totalPackages: { $addToSet: '$packageDetails._id' },
                            bookingCountsPerPackage: {
                                $push: '$bookings.packageId',
                            },
                        },
                    },
                    {
                        $addFields: {
                            bookingsPerMonth: {
                                $map: {
                                    input: { $setUnion: '$bookingsPerMonth' },
                                    as: 'month',
                                    in: {
                                        month: '$$month',
                                        count: {
                                            $size: {
                                                $filter: {
                                                    input: '$bookingsPerMonth',
                                                    as: 'm',
                                                    cond: { $eq: ['$$m', '$$month'] },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            totalPackages: { $size: '$totalPackages' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            totalBookings: 1,
                            totalAmount: 1,
                            totalPackages: 1,
                            bookingsPerMonth: 1,
                            bookingCountsPerPackage: 1,
                        },
                    },
                    {
                        $addFields: {
                            mostBookedPackage: {
                                $arrayElemAt: [
                                    {
                                        $slice: [
                                            {
                                                $map: {
                                                    input: {
                                                        $slice: [
                                                            {
                                                                $sortArray: {
                                                                    input: {
                                                                        $map: {
                                                                            input: {
                                                                                $setUnion: '$bookingCountsPerPackage',
                                                                            },
                                                                            as: 'pkgId',
                                                                            in: {
                                                                                packageId: '$$pkgId',
                                                                                count: {
                                                                                    $size: {
                                                                                        $filter: {
                                                                                            input: '$bookingCountsPerPackage',
                                                                                            as: 'b',
                                                                                            cond: { $eq: ['$$b', '$$pkgId'] },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                    sortBy: { count: -1 },
                                                                },
                                                            },
                                                            1,
                                                        ],
                                                    },
                                                    as: 'top',
                                                    in: '$$top',
                                                },
                                            },
                                            1,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                ]).exec();
                return data[0] || {
                    totalBookings: 0,
                    totalAmount: 0,
                    totalPackages: 0,
                    bookingsPerMonth: [],
                    mostBookedPackage: null,
                };
            }
            catch (err) {
                console.error('Dashboard Data Error:', err);
                throw new Error('Failed to fetch dashboard data');
            }
        });
    }
}
exports.AgentRepository = AgentRepository;
