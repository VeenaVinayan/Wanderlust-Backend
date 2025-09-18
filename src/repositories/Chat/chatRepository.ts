import { injectable } from "inversify";
import { BaseRepository } from "../Base/BaseRepository";
import Message, { IMessage } from "../../models/Message";
import { IChatRepository } from "../../Interfaces/Chat/IChatRepository";
import { IChatUsers } from "../../Types/chat.types";
import mongoose from "mongoose";
import { TMessage } from "../../Types/chat.types";

@injectable()
export class ChatRepository
  extends BaseRepository<IMessage>
  implements IChatRepository
{
  private readonly _messageModel = Message;
  constructor() {
    super(Message);
  }
  async getAllUsers(userId: string): Promise<IChatUsers[] | null> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const chatUsers = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userObjectId }, { receiver: userObjectId }],
          },
        },
        {
          $addFields: {
            otherUser: {
              $cond: [
                { $eq: ["$sender", userObjectId] },
                "$receiver",
                "$sender",
              ],
            },
            isUnread: {
              $and: [
                { $eq: ["$receiver", userObjectId] },
                { $eq: ["$isRead", false] },
              ],
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$otherUser",
            lastMessage: { $first: "$content" },
            lastMessageTime: { $first: "$createdAt" },
            unreadCount: {
              $sum: {
                $cond: [{ $eq: ["$isUnread", true] }, 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: "$user._id",
            name: "$user.name",
            profilePic: "$user.profilePic",
            lastMessage: 1,
            lastMessageTime: 1,
            unreadCount: 1,
          },
        },
        {
          $sort: { lastMessageTime: -1 },
        },
      ]);
      return chatUsers;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getMessages(sender: string, receiver: string): Promise<TMessage[]> {
    try {
      await this._messageModel.updateMany(
        {
          receiver: new mongoose.Types.ObjectId(receiver),
        },
        {
          $set: { isRead: true },
        }
      );
      const messages = await this._messageModel
        .find({
          $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender },
          ],
        })
        .sort({ createdAt: 1 });
      return messages.map((msg) => ({
        sender: msg.sender.toString(),
        receiver: msg.receiver.toString(),
        content: msg.content,
        createdAt: msg.get("createdAt"),
        isRead: msg.isRead,
      }));
    } catch (err) {
      console.error("Error in Get Messages ::", err);
      throw err;
    }
  }
}
