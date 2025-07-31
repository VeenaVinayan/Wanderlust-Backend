"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PackageSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    agent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    images: [{
            type: String,
            required: true,
        }],
    status: {
        type: Boolean,
        default: true,
    },
    day: {
        type: Number,
        required: true,
    },
    night: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    totalCapacity: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    itinerary: [{
            day: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            activities: {
                type: String,
                required: true,
            },
            meals: [{
                    type: String,
                    required: true,
                }],
            stay: {
                type: String,
                required: true,
            },
            transfer: {
                type: String,
                required: true,
            },
        }],
    isVerified: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
}, { timestamps: true });
const Package = mongoose_1.default.model('Package', PackageSchema);
exports.default = Package;
