"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
;
const BookingSchema = new mongoose_1.default.Schema({
    bookingId: {
        type: String,
        required: true,
        default: () => crypto_1.default.randomBytes(6).toString('hex').toUpperCase(), // Ensure this returns the ID
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    packageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    tripDate: {
        type: Date,
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    travellers: {
        adult: {
            type: Number,
            required: true,
        },
        children: {
            type: Number,
            required: true,
            default: 0,
        },
        infant: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    totalGuest: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Completed', 'Failed', 'Refunded'],
        default: 'Completed',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    tripStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
        required: true,
    },
}, { timestamps: true });
const Booking = mongoose_1.default.model('Booking', BookingSchema);
exports.default = Booking;
