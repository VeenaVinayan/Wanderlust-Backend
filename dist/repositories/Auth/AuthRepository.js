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
exports.AuthRepository = void 0;
const BaseRepository_1 = require("../Base/BaseRepository");
const User_1 = __importDefault(require("../../models/User"));
const Otp_1 = __importDefault(require("../../models/Otp"));
const Agent_1 = __importDefault(require("../../models/Agent"));
class AuthRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.default);
        this._userModel = User_1.default;
        this._otpModel = Otp_1.default;
        this._agentModel = Agent_1.default;
    }
    isUserExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userModel.findOne({
                    email: email,
                });
                return user;
            }
            catch (err) {
                console.error("Error occurred ::", err);
                throw err;
            }
        });
    }
    getOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOtp = yield this._otpModel.findOne({
                email: email,
            });
            if (!userOtp) {
                throw new Error("OTP not found for the given email !");
            }
            return userOtp;
        });
    }
    saveOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpData = new Otp_1.default({
                email,
                otp,
            });
            yield otpData.save();
        });
    }
    updateOtp(otpData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedOtp = yield this._otpModel.findOneAndUpdate({ email: otpData.email }, {
                otp: otpData.otp,
                createdAt: new Date(),
            }, { upsert: true, new: true });
            return updatedOtp;
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.findOne({ email: email }, { _id: 1, name: 1, email: 1, password: 1, phone: 1, role: 1, status: 1 });
            return user;
        });
    }
    resetPassword(id, hashPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(id, { password: hashPassword }, { new: true });
        });
    }
    registerAgent(agentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agent = new Agent_1.default(agentData);
                yield agent.save();
                return true;
            }
            catch (err) {
                console.log("Error in Register Agent !!");
                throw err;
            }
        });
    }
    getAgentData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._agentModel
                    .findOne({ userId: id }, { address: 1, isVerified: 1, _id: 0 })
                    .lean();
            }
            catch (err) {
                console.error("Error in agent data fetch");
                throw err;
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
