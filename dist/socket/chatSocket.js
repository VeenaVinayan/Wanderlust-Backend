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
exports.chatHandlers = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const chatHandlers = (socket, io, userSocketMap) => {
    socket.on("send-message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sender, receiver, content } = message;
            if (!sender || !receiver || !content)
                return;
            const newMessage = yield Message_1.default.create({
                sender,
                receiver,
                content,
            });
            const receiverSocketId = userSocketMap[receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", newMessage);
            }
            socket.emit("receive-message", newMessage);
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    }));
};
exports.chatHandlers = chatHandlers;
