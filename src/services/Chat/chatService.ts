import { inject, injectable } from 'inversify';
import { IChatRepository } from '../../Interfaces/Chat/IChatRepository';
import { IChatService } from '../../Interfaces/Chat/IChatService';
import { IChatUsers } from '../../Types/chat.types';
import { IMessage } from '../../models/Message';

@injectable()
export class ChatService implements IChatService{
     constructor(
         @inject('IChatRepository') private _chatRepository : IChatRepository
     ){}
     
      async getAllUsers(userId : string) : Promise<IChatUsers [] | null>{
         try{
                return await this._chatRepository.getAllUsers(userId);
         }catch(err){
             throw err;
         }
      }

      async getMessages(sender: string, receiver: string): Promise<IMessage[]> {
          try{
               return await this._chatRepository.getMessages(sender,receiver);
          }catch(err){
              throw err;
          }
      }
}
