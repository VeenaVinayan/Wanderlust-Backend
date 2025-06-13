"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    packageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });
const Review = mongoose_1.default.model('Review', ReviewSchema);
exports.default = Review;
