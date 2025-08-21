import {IUser } from '../models/User';
import { IAgentChatDataDTO } from '../DTO/userDTO';

class AgentMapper{
    agentDataMapper(data : IUser):IAgentChatDataDTO{
        return {
             id:data._id.toString(),
             name:data?.name
        }
    }
}
const agentMapper = new AgentMapper();

export default agentMapper;