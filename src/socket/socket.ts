import { Server, Socket } from 'socket.io';
import http from 'http';
import Notification from '../models/Notification';
import { chatHandlers } from './chatSocket';

const userSocketMap: Record<string, string> = {}; 
let io: Server;

export const initializeSocket = (server: http.Server): void => {
  console.log("Inside Socket intialize file !!");
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"], 
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
 // video-call handlers
    console.log("User socker Map ::",userSocketMap);

    socket.on("call-user",({to,offer}) =>{
         const targetSocket = userSocketMap[to];
         if(targetSocket){
          console.log("Call from ",userId);
          io.to(targetSocket).emit("receive-call",{
             from:userId,
             offer,
           });
         }
    });
   socket.on("answer-call",({to,answer}) =>{
        const targetSocket = userSocketMap[to];
        console.log('Answer calll from',to);
        if(targetSocket){
           io.to(targetSocket).emit("call-answered",{
              answer,
           })
        }
    });
    socket.on("ice-candidate",({to,candidate}) =>{
       const targetSocket = userSocketMap[to];
       if(targetSocket){
         io.to(targetSocket).emit("ice-candidate",{candidate});
       }
    })
    socket.on("end-call",({to}) =>{
       const targetSocket = userSocketMap[to];
       console.log("End call from  ",to);
       if(targetSocket){
          io.to(targetSocket).emit("call-ended");
       }
    });
   socket.on("decline-call",({to}) =>{
      const targetSocket = userSocketMap[to];
      if(targetSocket){
         io.to(targetSocket).emit("call-declined");
      }
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
