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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const socket_1 = require("./socket");
const sendNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = payload;
    const userid = userId.toString();
    const socketId = socket_1.userSocketMap[userid];
    console.log(`User connected  ${userId} with ${socketId}`);
    if (socketId) {
        socket_1.io.to(socketId).emit("new-notification", payload);
        console.log(`Notification sent to ${userId} with ${payload}`);
        return true;
    }
    else {
        console.log(`User ${userId} is not connected`);
        return false;
    }
});
exports.sendNotification = sendNotification;
