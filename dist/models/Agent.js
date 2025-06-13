"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AgentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        home: {
            type: String,
            required: true,
        },
        street: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        }
    },
    license: {
        type: String,
        default: "",
    },
    isVerified: {
        type: String,
        default: "Pending",
    }
}, { timestamps: true });
const Agent = mongoose_1.default.model('Agent', AgentSchema);
exports.default = Agent;
