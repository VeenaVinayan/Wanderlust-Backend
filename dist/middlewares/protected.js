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
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            console.log('No token provided !!');
            res.status(403).json({ message: 'Access denied. No token provided !' });
            return;
        }
        try {
            let payload = (0, jwt_1.verifyToken)(token);
            const user = yield User_1.default.findById(payload.id);
            if (!user) {
                console.log('No token provided -- by payload!!');
                res.status(403).json({ message: 'Access denied. No User provided !' });
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({ message: 'Invalid Token !' });
            return;
        }
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = auth;
