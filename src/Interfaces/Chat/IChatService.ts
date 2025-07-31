import { IChatUserDTO } from '../../DTO/chatDTO';
import { IMessage } from '../../models/Message';
import { TChatMessage ,TMessage} from '../../Types/chat.types';

export interface IChatService{
     getAllUsers(userId : string): Promise<IChatUserDTO [] | null>
     getMessages(sender : string, receiver: string): Promise<TMessage[]>
}
