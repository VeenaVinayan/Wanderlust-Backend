import { io, userSocketMap } from './socket';
import {  TNotification } from '../Types/notification';

export const sendNotification = async (payload: TNotification) :Promise<boolean> => {
  const { userId } = payload;
  console.log("User Id is ::::",userId , typeof userId);
  console.log(`Socket Map ::${userSocketMap}`);
  const socketId = userSocketMap[String(userId)];
  console.log(`User connected  ${userId} with ${socketId}`);
  if (socketId) {
    io.to(socketId).emit("new-notification", payload);
    console.log(`Notification sent to ${userId} with ${payload}`);
    return true;
  } else {
    console.log(`User ${userId} is not connected`);
    return false;
  }
};
