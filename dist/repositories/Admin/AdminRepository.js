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
        this.userModel = User_1.default;
        this.agentModel = Agent_1.default;
    }
    findAllData(user, perPage, page, search, sortBy, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    role: user,
                };
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ];
                }
                const sortOptions = {};
                if (sortBy) {
                    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
                }
                const [data, totalCount] = yield Promise.all([
                    this.userModel
                        .find(query)
                        .sort(sortOptions)
                        .skip((page - 1) * perPage)
                        .limit(perPage)
                        .select("_id name email phone status"),
                    this.userModel.countDocuments({ role: user })
                ]);
                return { data, totalCount };
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Error fetching users !");
            }
        });
    }
    blockOrUnblock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Error in block/unblock User in repository !!", id);
                const user = yield this.userModel.findById(id);
                console.log('After search:', user);
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
    findPendingAgent(perPage, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.agentModel.aggregate([
                    {
                        $match: { isVerified: "Uploaded" }
                    },
                    {
                        $facet: {
                            metadata: [{ $count: "total" }],
                            data: [
                                { $skip: (page - 1) * perPage },
                                { $limit: perPage },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "userId",
                                        foreignField: "_id",
                                        as: "userData"
                                    }
                                },
                                { $unwind: "$userData" },
                                {
                                    $project: {
                                        _id: 1,
                                        license: 1,
                                        name: "$userData.name",
                                        email: "$userData.email",
                                        phone: "$userData.phone"
                                    }
                                }
                            ]
                        }
                    }
                ]);
            }
            catch (err) {
                console.log('Error in fetch pending data in Repository !!');
                throw err;
            }
        });
    }
    agentApproval(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('Agent approval');
                const result = yield this.agentModel.updateOne({ _id: agentId }, {
                    $set: { isVerified: "Approved" }
                });
                if (result.matchedCount === 1 && result.modifiedCount === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log('Error in Agent Approval !!');
                throw err;
            }
        });
    }
    rejectAgentRequest(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('Agent approval');
                const result = yield this.agentModel.updateOne({ _id: agentId }, {
                    $set: { isVerified: "Rejected" }
                });
                if (result.matchedCount === 1 && result.modifiedCount === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log('Error in Agent Approval !!');
                throw err;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
