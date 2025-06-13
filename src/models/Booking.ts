import mongoose, { Schema, Document } from "mongoose";
import crypto from 'crypto';

export interface IBooking extends Document {
    _id: string;
    bookingId: string;
    userId: string;
    packageId: string;
    bookingDate: Date;
    tripDate:Date,
    travellers: {
        adult: number;
        children: number;
        infant: number;
    };
    totalGuest: number;
    totalAmount: number;
    paymentStatus: string;
    paymentDate: string;
    email:string;
    phone:string;
    tripStatus: string;  
};

const BookingSchema: Schema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        default: () => crypto.randomBytes(6).toString('hex').toUpperCase(),  // Ensure this returns the ID
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
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
    email:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required:true,
    },
    tripStatus: {
        type: String,  
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
        required: true,
    },
}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
