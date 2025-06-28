import { IChatUsers } from '../../Types/chat.types';
import { IMessage } from '../../models/Message';

export interface IChatService{
     getAllUsers(userId : string): Promise<IChatUsers [] | null>
     getMessages(sender : string, receiver: string): Promise<IMessage[]>
}
