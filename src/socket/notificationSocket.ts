import { io, userSocketMap } from './socket';
import {  TNotification } from '../Types/notification';

export const sendNotification = async (payload: TNotification) :Promise<boolean> => {
  const { userId } = payload;
  const userid = userId.toString();
  const socketId = userSocketMap[userid];

  if(socketId){
    io.to(socketId).emit("new-notification", payload);
    return true;
  }else{
    return false;
  }
};
