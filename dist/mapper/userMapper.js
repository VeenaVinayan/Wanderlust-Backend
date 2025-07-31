"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AgentMapper {
    agentDataMapper(data) {
        return {
            id: data._id.toString(),
            name: data === null || data === void 0 ? void 0 : data.name
        };
    }
}
const agentMapper = new AgentMapper();
exports.default = agentMapper;
