import { io, userSocketMap } from '../socket/socket';

export const emitNotification = (userId: string, data: { message: string; type: string }) => {
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit("new-notification", data);
  }
};
