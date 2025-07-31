import { IChatUsers} from '../Types/chat.types';
import { IChatUserDTO } from '../DTO/chatDTO';

class ChatMapper{
    chatUserMapper(chatuser :IChatUsers): IChatUserDTO{
        return{
            id: chatuser._id.toString(),
            name:chatuser.name,
            lastMessageTime:chatuser.lastMessageTime,
            lastMessage:chatuser.lastMessage,
            unreadCount:chatuser.unreadCount
        }
    }
}

const chatMapper = new ChatMapper();
export default chatMapper;