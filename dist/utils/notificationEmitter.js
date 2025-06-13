"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = void 0;
const socket_1 = require("../socket/socket");
const emitNotification = (userId, data) => {
    const socketId = socket_1.userSocketMap[userId];
    if (socketId) {
        socket_1.io.to(socketId).emit("new-notification", data);
    }
};
exports.emitNotification = emitNotification;
