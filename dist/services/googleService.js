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
exports.GoogleService = void 0;
const authRepository_1 = __importDefault(require("../repositories/authRepository"));
const User_1 = __importDefault(require("../models/User"));
const axios_1 = __importDefault(require("axios"));
const googleAuth_1 = __importDefault(require("../utils/googleAuth"));
class GoogleService {
    constructor() { }
    googleAuth(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Inside Google service |', code);
                const googleRes = yield googleAuth_1.default.getToken(code);
                googleAuth_1.default.setCredentials(googleRes.tokens);
                const userRes = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
                const user = this.findOrCreateUser(userRes.data);
                return user;
            }
            catch (err) {
                console.log('Error in Google Service ::', err);
            }
        });
    }
    findOrCreateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!payload.email) {
                    throw new Error('No Email found in Google payload!');
                }
                let user = yield authRepository_1.default.isUserExist(payload.email);
                if (!user) {
                    user = yield User_1.default.create({
                        name: payload.name,
                        email: payload.email,
                        password: 'google-auth',
                        phone: 'NA',
                        status: true,
                        role: 'User',
                    });
                }
                console.log('User data :', user);
                return user;
            }
            catch (error) {
                console.error('Error finding or creating user:', error);
                throw new Error('Error creating user from Google Data!');
            }
        });
    }
}
exports.GoogleService = GoogleService;
