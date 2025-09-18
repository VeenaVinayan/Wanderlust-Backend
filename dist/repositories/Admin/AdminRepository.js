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
exports.AdminRepository = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Agent_1 = __importDefault(require("../../models/Agent"));
class AdminRepository {
    constructor() {
        this._userModel = User_1.default;
        this._agentModel = Agent_1.default;
    }
    findAllData(user, perPage, page, search, sortBy, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { role: user };
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ];
                }
                const sortOptions = {};
                if (sortBy) {
                    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
                }
                const [data, totalCount] = yield Promise.all([
                    this._userModel
                        .find(query)
                        .sort(sortOptions)
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .select("_id name email phone status"),
                    this._userModel.countDocuments(query).exec(),
                ]);
                return { data, totalCount };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    blockOrUnblock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userModel.findById(userId);
                if (user) {
                    user.status = !user.status;
                    const res = yield user.save();
                    if (res)
                        return true;
                    else
                        return false;
                }
                return false;
            }
            catch (_a) {
                console.log("Error in block/unblock User !!");
                throw new Error("Error in Block/UnBlock");
            }
        });
    }
    findPendingAgent(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { page, perPage, searchParams } = params;
                const query = {};
                if (searchParams.search) {
                    query.$or = [
                        { "userData.name": { $regex: searchParams.search, $options: "i" } },
                        { "userData.email": { $regex: searchParams.search, $options: "i" } },
                    ];
                }
                const data = yield this._agentModel.aggregate([
                    {
                        $match: { isVerified: "Uploaded" },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    { $unwind: "$userData" },
                    {
                        $match: {
                            $or: [
                                {
                                    "userData.name": { $regex: searchParams.search, $options: "i" },
                                },
                                {
                                    "userData.email": {
                                        $regex: searchParams.search,
                                        $options: "i",
                                    },
                                },
                                {
                                    "userData.phone": {
                                        $regex: searchParams.search,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $facet: {
                            metadata: [{ $count: "total" }],
                            data: [
                                { $skip: (page - 1) * perPage },
                                { $limit: perPage },
                                {
                                    $project: {
                                        _id: 1,
                                        license: 1,
                                        address: 1,
                                        name: "$userData.name",
                                        email: "$userData.email",
                                        phone: "$userData.phone",
                                    },
                                },
                            ],
                        },
                    },
                ]);
                const pendingAgent = {
                    data: ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.data) || [],
                    totalCount: ((_c = (_b = data[0]) === null || _b === void 0 ? void 0 : _b.metadata[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                };
                return pendingAgent;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    agentApproval(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._agentModel.updateOne({ _id: agentId }, {
                    $set: { isVerified: "Approved" },
                });
                if (result.matchedCount === 1 && result.modifiedCount === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    rejectAgentRequest(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._agentModel.updateOne({ _id: agentId }, {
                    $set: { isVerified: "Rejected" },
                });
                if (result.matchedCount === 1 && result.modifiedCount === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    findAdminId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = yield this._userModel.findOne({ role: "Admin" }, { _id: 1 });
                return adminId;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
