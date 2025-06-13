import { Server, Socket } from 'socket.io';
import http from 'http';
import Notification from '../models/Notification';

const userSocketMap: Record<string, string> = {}; 

let io: Server;

export const initializeSocket = (server: http.Server): void => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3001"], 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId as string;

    if(userId && userId !== "undefined") {
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

export { io, userSocketMap };
