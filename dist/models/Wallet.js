"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WalletSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    transaction: [{
            transactionDate: {
                type: Date,
                default: Date.now()
            },
            amount: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            }
        }]
}, { timestamps: true });
const Wallet = mongoose_1.default.model('Wallet', WalletSchema);
exports.default = Wallet;
