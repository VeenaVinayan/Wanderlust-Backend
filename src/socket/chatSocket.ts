import { Socket, Server } from 'socket.io';
import Message from '../models/Message';

export const chatHandlers = (socket: Socket, io: Server, userSocketMap: Record<string, string>) => {
    socket.on("send-message", async (message) => {
      try {
        const { sender, receiver, content} =message;
        if(!sender || !receiver || !content) return;
        const newMessage = await Message.create({
          sender,
          receiver,
          content,
        });
       const receiverSocketId = userSocketMap[receiver];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", newMessage);
        }
       socket.emit("receive-message", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
};
