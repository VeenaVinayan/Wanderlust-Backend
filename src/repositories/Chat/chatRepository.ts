import { injectable } from 'inversify';
import { BaseRepository } from '../Base/BaseRepository';
import Message, { IMessage} from '../../models/Message';
import { IChatRepository } from '../../Interfaces/Chat/IChatRepository';
import { IChatUsers } from '../../Types/chat.types';
import mongoose from 'mongoose';

@injectable()
export class ChatRepository extends BaseRepository<IMessage> implements IChatRepository{
    private readonly _messageModel = Message;
    constructor(){
        super(Message);
    }
     async getAllUsers(userId :string ): Promise< IChatUsers[]| null> {
           try{
              const userObjectId = new mongoose.Types.ObjectId(userId);
              const chatUsers : IChatUsers [] | null = await Message.aggregate([
                    {
                        $match: {
                        $or: [
                            { sender: userObjectId },
                            { receiver: userObjectId }
                        ]
                        }
                    },
                    {
                        $project: {
                        otherUser: {
                            $cond: [
                            { $eq: ["$sender", userObjectId] },
                            "$receiver",
                            "$sender"
                            ]
                        }
                        }
                    },
                    {
                        $group: {
                        _id: "$otherUser"
                        }
                    },
                    {
                        $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $project: {
                        _id: "$user._id",
                        name: "$user.name",
                      }
                    }
              ]);
            console.log("Chat users ::",chatUsers);
            return chatUsers;            
        }catch(err){
            throw err;
       } 
     }
  async getMessages(sender: string, receiver: string): Promise<IMessage[]> {
  try {
    const messages: IMessage[] = await this._messageModel.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender }
      ]
    });
    console.log("Messages ::",messages);
    return messages;
  } catch (err) {
    console.error('Error in Get Messages ::', err);
    throw err;
  }
 }
}
