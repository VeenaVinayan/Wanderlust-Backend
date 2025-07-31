"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketMap = exports.io = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const chatSocket_1 = require("./chatSocket");
const userSocketMap = {};
exports.userSocketMap = userSocketMap;
let io;
const initializeSocket = (server) => {
    console.log("Inside Socket intialize file !!");
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("A user connected", socket.id, userId);
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        (0, chatSocket_1.chatHandlers)(socket, io, userSocketMap);
        // video-call handlers
        console.log("User socker Map ::", userSocketMap);
        socket.on("call-user", ({ to, offer }) => {
            const targetSocket = userSocketMap[to];
            if (targetSocket) {
                console.log("Call from ", userId);
                io.to(targetSocket).emit("receive-call", {
                    from: userId,
                    offer,
                });
            }
        });
        socket.on("answer-call", ({ to, answer }) => {
            const targetSocket = userSocketMap[to];
            console.log('Answer calll from', to);
            if (targetSocket) {
                io.to(targetSocket).emit("call-answered", {
                    answer,
                });
            }
        });
        socket.on("ice-candidate", ({ to, candidate }) => {
            const targetSocket = userSocketMap[to];
            if (targetSocket) {
                io.to(targetSocket).emit("ice-candidate", { candidate });
            }
        });
        socket.on("end-call", ({ to }) => {
            const targetSocket = userSocketMap[to];
            console.log("End call from  ", to);
            if (targetSocket) {
                io.to(targetSocket).emit("call-ended");
            }
        });
        socket.on("decline-call", ({ to }) => {
            const targetSocket = userSocketMap[to];
            if (targetSocket) {
                io.to(targetSocket).emit("call-declined");
            }
        });
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
