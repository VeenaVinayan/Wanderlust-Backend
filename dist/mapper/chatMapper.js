"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatMapper {
    chatUserMapper(chatuser) {
        return {
            id: chatuser._id.toString(),
            name: chatuser.name,
            lastMessageTime: chatuser.lastMessageTime,
            lastMessage: chatuser.lastMessage,
            unreadCount: chatuser.unreadCount
        };
    }
}
const chatMapper = new ChatMapper();
exports.default = chatMapper;
