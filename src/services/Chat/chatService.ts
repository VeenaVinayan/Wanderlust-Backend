import { inject, injectable } from "inversify";
import { IChatRepository } from "../../Interfaces/Chat/IChatRepository";
import { IChatService } from "../../Interfaces/Chat/IChatService";
import { IChatUsers, TMessage } from "../../Types/chat.types";
import chatMapper from "../../mapper/chatMapper";
import { IChatUserDTO } from "../../DTO/chatDTO";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject("IChatRepository") private _chatRepository: IChatRepository
  ) {}
  async getAllUsers(userId: string): Promise<IChatUserDTO[] | null> {
    try {
      const data: IChatUsers[] | null = await this._chatRepository.getAllUsers(
        userId
      );
      if (!data) return null;
      return data.map((user) => chatMapper.chatUserMapper(user));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getMessages(sender: string, receiver: string): Promise<TMessage[]> {
    try {
      return await this._chatRepository.getMessages(sender, receiver);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
