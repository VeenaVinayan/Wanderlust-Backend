"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketMap = exports.io = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const userSocketMap = {};
exports.userSocketMap = userSocketMap;
let io;
const initializeSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3001"],
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            for (const [userId, socketId] of Object.entries(userSocketMap)) {
                if (socketId === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
        });
    });
};
exports.initializeSocket = initializeSocket;
