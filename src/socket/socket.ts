import { Server, Socket } from 'socket.io';
import http from 'http';
import { chatHandlers } from './chatSocket';
import dotenv from 'dotenv';
const userSocketMap: Record<string, string> = {}; 
let io: Server;

dotenv.config();

export const initializeSocket = (server: http.Server): void => {
  console.log("Inside Socket intialize file !!");
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, 
      methods: ["GET", "POST"],
      credentials:true
    },
  });
 io.on("connection", (socket: Socket) => {    
    const userId = socket.handshake.query.userId as string;
    console.log("A user connected", socket.id, userId);
    if(userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }
    chatHandlers(socket,io, userSocketMap);
    console.log("User socker Map ::",userSocketMap);

    socket.on("outgoing-video-call", (data) => {
    console.log("Make an outgoing call Agent ",data);
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
        console.log("Receive incoming call",data);
        const socketId = userSocketMap[data.to];
        io.to(socketId).emit("accepted-call", { ...data, startedAt: new Date() });
    } catch (error:unknown) {
      if(error instanceof Error)
         console.error("Error in accept-incoming-call handler:", error.message);
    }
  });
 
  socket.on("agent-call-accept", async (data) => {
    console.log("Agent Id is ::",data.agentId);
    const socketId = userSocketMap[data.agentId];
    console.log("Accept Incoming Call :: socket ::",socketId);
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
      console.log("User disconnected", socket.id);
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
