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
const User_1 = __importDefault(require("../models/User"));
const Otp_1 = __importDefault(require("../models/Otp"));
const Agent_1 = __importDefault(require("../models/Agent"));
const authRepository = {
    isUserExist: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Inside Repository !!");
            const user = yield User_1.default.findOne({ email: email });
            console.log("After find  ::", user);
            return user;
        }
        catch (err) {
            console.error('Error occurred ::', err);
            throw err;
        }
    }),
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Register user in repository !!!');
            const user = new User_1.default(userData);
            return yield user.save();
        }
        catch (err) {
            console.error("Error occurred in registerUser!", err);
            throw err;
        }
    }),
    saveOtp: (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Save Otp !...");
            const otpData = new Otp_1.default({
                email,
                otp
            });
            yield otpData.save();
        }
        catch (err) {
            console.log(" Error occured : ", err);
            throw err;
        }
    }),
    getOtp: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userOtp = yield Otp_1.default.findOne({ email: email });
            if (!userOtp) {
                throw new Error("OTP not found for the given email !");
            }
            return userOtp;
        }
        catch (err) {
            throw err;
        }
    }),
    updateOtp: (otpData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Auth Repository !!! ');
            const updatedOtp = yield Otp_1.default.findOneAndUpdate({ email: otpData.email }, {
                otp: otpData.otp,
                createdAt: new Date(),
            }, { upsert: true, new: true });
            return updatedOtp;
        }
        catch (err) {
            throw err;
        }
    }),
    login: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('INside Auth Repository !!');
            let user;
            console.log(email);
            user = yield User_1.default.findOne({ email: email }, { _id: 1, name: 1, email: 1, password: 1, phone: 1, role: 1, status: 1 });
            console.log(`User :: ${user}`);
            return user;
        }
        catch (err) {
            throw err;
        }
    }),
    resetPassword: (id, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield User_1.default.findByIdAndUpdate(id, { password: hashPassword }, { new: true });
            console.log('Reset password value :: ', result);
        }
        catch (err) {
            throw err;
        }
    }),
    registerAgent: (agentData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Register Agent ! Repositroy');
            const agent = new Agent_1.default(agentData);
            yield agent.save();
            return true;
        }
        catch (err) {
            console.log('Error in Register Agent !!');
            throw err;
        }
    }),
    getAgentData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Get agent data !', id);
            return yield Agent_1.default.findOne({ userId: id }, { address: 1, isVerified: 1, _id: 0 }).lean();
        }
        catch (err) {
            console.error('Error in agent data fetch');
            throw err;
        }
    }),
};
exports.default = authRepository;
