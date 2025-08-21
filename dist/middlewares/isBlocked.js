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
exports.isBlocked = void 0;
const User_1 = __importDefault(require("../models/User"));
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const StatusMessage_1 = require("../enums/StatusMessage");
const isBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ message: StatusMessage_1.StatusMessage.UNAUTHORIZED });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.USER_NOT_FOUND });
            return;
        }
        if (!user.status) {
            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.BLOCKED });
            return;
        }
        next();
    }
    catch (error) {
        res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
    }
});
exports.isBlocked = isBlocked;
