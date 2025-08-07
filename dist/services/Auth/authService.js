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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const otpHelper_1 = __importDefault(require("../../helper/otpHelper"));
const emailHelper_1 = __importDefault(require("../../helper/emailHelper"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailSender_1 = __importDefault(require("../../utils/mailSender"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("../../utils/jwt");
(0, inversify_1.injectable)();
let AuthService = class AuthService {
    constructor(_authRepository) {
        this._authRepository = _authRepository;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Service ... user Data ::", userData);
                const { email } = userData;
                const isUserExist = yield this._authRepository.isUserExist(email);
                // const res: { user: boolean ; otp?: string; time?: Date } = { user: isUserExist? true:false };
                const res = isUserExist ? true : false;
                console.log("User Response :: ", res);
                if (isUserExist === null) {
                    const otp = otpHelper_1.default.generateOtp();
                    console.log("Otp is ::", otp);
                    // res.otp = otp;
                    // res.time = new Date();
                    const body = otpHelper_1.default.generateEmailBody(otp);
                    yield (0, mailSender_1.default)(email, "OTP Verification", body);
                    yield this._authRepository.saveOtp(email, otp);
                    console.log(res);
                }
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    otpSubmit(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { data, user } = userData;
                const { name, email, phone, password } = data || { name: "", email: "", phone: "", password: "", address: "" };
                const otpUser = userData.otp || " ";
                const otpValue = yield this._authRepository.getOtp(email);
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
                        const res = yield this._authRepository.createNewData(User);
                        console.log("Agent Data ::", res);
                        if (user === "Agent" && res._id) {
                            const agentData = data;
                            const Agent = {
                                userId: new mongoose_1.default.Types.ObjectId(res._id),
                                address: {
                                    home: (_a = data === null || data === void 0 ? void 0 : data.home) !== null && _a !== void 0 ? _a : '',
                                    street: (_b = data === null || data === void 0 ? void 0 : data.street) !== null && _b !== void 0 ? _b : '',
                                    city: (_c = data === null || data === void 0 ? void 0 : data.city) !== null && _c !== void 0 ? _c : '',
                                    state: (_d = data === null || data === void 0 ? void 0 : data.state) !== null && _d !== void 0 ? _d : "Kerala",
                                    country: (_e = data === null || data === void 0 ? void 0 : data.country) !== null && _e !== void 0 ? _e : "India",
                                    zipcode: (_f = data === null || data === void 0 ? void 0 : data.zipcode) !== null && _f !== void 0 ? _f : "678930",
                                },
                            };
                            console.log(" Data agent ::", Agent);
                            yield this._authRepository.registerAgent(Agent);
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
        });
    }
    resendOtp(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Resend OTP ");
                const otpNew = otpHelper_1.default.generateOtp();
                const body = otpHelper_1.default.generateEmailBody(otpNew);
                (0, mailSender_1.default)(userEmail, "OTP Verification", body);
                this._authRepository.saveOtp(userEmail, otpNew);
                const dataOtp = {
                    email: userEmail,
                    otp: otpNew,
                };
                const data = this._authRepository.updateOtp(dataOtp);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Auth Services !!', userData);
                let res;
                let response = yield this._authRepository.login(userData.email);
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
                        const agent = yield this._authRepository.getAgentData(response.id.toString());
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
        });
    }
    getAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = (0, jwt_1.verifyRefreshToken)(token);
            if (accessToken) {
                return accessToken;
            }
            else {
                return null;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Forgot password Service !');
            const user = yield this._authRepository.isUserExist(email);
            if (user) {
                const userId = {
                    id: user.id.toString(),
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
        });
    }
    resetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Reset password SErvice !!');
                const user = (0, jwt_1.verifyToken)(token);
                console.log(`User after decode Token === ${user}`);
                if (user) {
                    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
                    yield this._authRepository.resetPassword(user.id, hashPassword);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    __param(0, (0, inversify_1.inject)("IAuthRepository")),
    __metadata("design:paramtypes", [Object])
], AuthService);
