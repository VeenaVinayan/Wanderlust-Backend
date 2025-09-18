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
exports.userSocketMap = exports.io = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const chatSocket_1 = require("./chatSocket");
const dotenv_1 = __importDefault(require("dotenv"));
const userSocketMap = {};
exports.userSocketMap = userSocketMap;
let io;
dotenv_1.default.config();
const initializeSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        (0, chatSocket_1.chatHandlers)(socket, io, userSocketMap);
        socket.on("outgoing-video-call", (data) => {
            const socketId = userSocketMap[data.to];
            io.to(socketId).emit("incoming-video-call", {
                to: data.to,
                from: data.from,
                callType: data.callType,
                agentName: data.agentName,
                roomId: data.roomId,
            });
        });
        socket.on("accept-incoming-call", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const socketId = userSocketMap[data.to];
                io.to(socketId).emit("accepted-call", Object.assign(Object.assign({}, data), { startedAt: new Date() }));
            }
            catch (error) {
                if (error instanceof Error)
                    console.error("Error in accept-incoming-call handler:", error.message);
            }
        }));
        socket.on("agent-call-accept", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const socketId = userSocketMap[data.agentId];
            io.to(socketId).emit("agent-accept", data);
        }));
        socket.on("reject-call", (data) => {
            const socketId = userSocketMap[data.to];
            socket.to(socketId).emit("call-rejected");
        });
        socket.on("leave-room", (data) => {
            const socketId = userSocketMap[data.to];
            socket.to(socketId).emit("user-left", data.to);
        });
        socket.on("disconnect", () => {
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
