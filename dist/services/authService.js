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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authRepository_1 = __importDefault(require("../repositories/authRepository"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const otpHelper_1 = __importDefault(require("../helper/otpHelper"));
const emailHelper_1 = __importDefault(require("../helper/emailHelper"));
const jwt_1 = require("../utils/jwt");
const authService = {
    register: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Service ... user Data ::", userData);
        const { email } = userData;
        const isUserExist = yield authRepository_1.default.isUserExist(email);
        const res = { user: isUserExist ? true : false };
        console.log("User Response :: ", res);
        if (isUserExist === null) {
            const otp = otpHelper_1.default.generateOtp();
            console.log("Otp is ::", otp);
            res.otp = otp;
            res.time = new Date();
            const body = otpHelper_1.default.generateEmailBody(otp);
            (0, mailSender_1.default)(email, "OTP Verification", body);
            authRepository_1.default.saveOtp(email, otp);
            console.log(res);
        }
        return res;
    }),
    otpSubmit: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Otp submit service !!");
            const { otp, data, user } = userData;
            console.log("User data on otp :: ", JSON.stringify(userData));
            const { name, email, phone, password } = data || { name: "", email: "", phone: "", password: "", address: "" };
            const otpUser = userData.otp || " ";
            const otpValue = yield authRepository_1.default.getOtp(email);
            if (!otpValue)
                return "error";
            const isOtpValid = otpValue.otp === otpUser;
            let timeDiff = 0;
            if (otpValue === null || otpValue === void 0 ? void 0 : otpValue.createdAt) {
                timeDiff = new Date().getTime() - new Date(otpValue === null || otpValue === void 0 ? void 0 : otpValue.createdAt).getTime();
            }
            if (isOtpValid && timeDiff < 60000) {
                if (password) {
                    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
                    const User = {
                        name,
                        email,
                        phone,
                        password: hashPassword,
                        role: user,
                    };
                    const res = yield authRepository_1.default.registerUser(User);
                    console.log("Agent Data ::", res);
                    if (user === "Agent" && typeof res._id) {
                        const Agent = {
                            userId: res._id,
                            address: {
                                home: data.house,
                                street: data.street,
                                city: data.city,
                                state: data.state,
                                country: data.country,
                                zipcode: data.zipcode,
                            },
                        };
                        console.log(" Data agent ::", Agent);
                        yield authRepository_1.default.registerAgent(Agent);
                    }
                    return "success";
                }
                else
                    return "error";
            }
            else {
                console.log("Invalid otp !");
                return "error";
            }
        }
        catch (err) {
            throw err;
        }
    }),
    resendOtp: (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Resend OTP ");
            const otpNew = otpHelper_1.default.generateOtp();
            const body = otpHelper_1.default.generateEmailBody(otpNew);
            (0, mailSender_1.default)(userEmail, "OTP Verification", body);
            authRepository_1.default.saveOtp(userEmail, otpNew);
            const dataOtp = {
                email: userEmail,
                otp: otpNew,
            };
            const data = authRepository_1.default.updateOtp(dataOtp);
            return data;
        }
        catch (err) {
            throw err;
        }
    }),
    login: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Auth Services !!', userData);
            let res;
            let response = yield authRepository_1.default.login(userData.email);
            if (!response)
                return "User";
            if (!response.status)
                return "Blocked";
            let isVerified = yield bcryptjs_1.default.compare(userData.password, response.password);
            if (isVerified) {
                const userData = {
                    id: response.id.toString(),
                    role: response.role,
                };
                const accessToken = (0, jwt_1.generateAccessToken)(userData);
                const refreshToken = (0, jwt_1.generateRefreshToken)(userData);
                const user = {
                    id: response.id,
                    name: response.name,
                    email: response.email,
                    phone: response.phone,
                    role: response.role,
                    status: response.status
                };
                res = {
                    accessToken,
                    refreshToken,
                    user,
                };
                if (response.role === "Agent") {
                    const agent = yield authRepository_1.default.getAgentData(response.id.toString());
                    console.log("Agent Data :::", agent);
                    if (agent) {
                        res = Object.assign(Object.assign({}, res), agent);
                    }
                }
                return res;
            }
            else {
                console.log('Invalid credentials !!');
                return "Invalid";
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }),
    getAccessToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = (0, jwt_1.verifyRefreshToken)(token);
        if (accessToken) {
            return accessToken;
        }
        else {
            return null;
        }
    }),
    forgotPassword: (email) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Forgot password Service !');
        const user = yield authRepository_1.default.isUserExist(email);
        if (user) {
            const userId = {
                id: user.id,
                role: user.role,
            };
            const token = (0, jwt_1.generateAccessToken)(userId);
            const body = emailHelper_1.default.generateEmailBody(token);
            (0, mailSender_1.default)(email, "Reset Password", body);
            return true;
        }
        else {
            return false;
        }
    }),
    resetPassword: (token, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Reset password SErvice !!');
            const user = (0, jwt_1.verifyToken)(token);
            console.log(`User = ${user}`);
            if (user) {
                const hashPassword = yield bcryptjs_1.default.hash(password, 10);
                const res = yield authRepository_1.default.resetPassword(user.id, hashPassword);
                console.log(' Reset password ::', res);
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            throw err;
        }
    })
};
exports.default = authService;
