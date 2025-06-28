import { IMessage } from '../../models/Message';
import { IBaseRepository } from '../../Interfaces/Base/IBaseRepository';
import { IChatUsers } from '../../Types/chat.types';

export interface IChatRepository extends IBaseRepository<IMessage>{
    getAllUsers(userId : string): Promise<IChatUsers [] | null>
    getMessages(sender : string, receiver : string): Promise<IMessage[]>
}