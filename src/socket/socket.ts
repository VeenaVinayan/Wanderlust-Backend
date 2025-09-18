import { Server, Socket } from 'socket.io';
import http from 'http';
import { chatHandlers } from './chatSocket';
import dotenv from 'dotenv';
const userSocketMap: Record<string, string> = {}; 
let io: Server;

dotenv.config();

export const initializeSocket = (server: http.Server): void => {
   io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, 
      methods: ["GET", "POST"],
      credentials:true
    },
  });
 io.on("connection", (socket: Socket) => {    
    const userId = socket.handshake.query.userId as string;
    if(userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }
    chatHandlers(socket,io, userSocketMap);
  
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
  socket.on("accept-incoming-call", async (data) => {
    try {
        const socketId = userSocketMap[data.to];
        io.to(socketId).emit("accepted-call", { ...data, startedAt: new Date() });
    } catch (error:unknown) {
      if(error instanceof Error)
         console.error("Error in accept-incoming-call handler:", error.message);
    }
  });
 
  socket.on("agent-call-accept", async (data) => {
    const socketId = userSocketMap[data.agentId];
    io.to(socketId).emit("agent-accept", data);
 });
  
  socket.on("reject-call", (data) => {
    const socketId = userSocketMap[data.to];
    socket.to(socketId).emit("call-rejected");
      });
  
  socket.on("leave-room", (data) => {
    const socketId = userSocketMap[data.to];
    socket.to(socketId).emit("user-left", data.to);
  });
  socket.on("disconnect", () => {
      for(const [userId, socketId] of Object.entries(userSocketMap)) {
        if(socketId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
  });
};

export { io, userSocketMap };
