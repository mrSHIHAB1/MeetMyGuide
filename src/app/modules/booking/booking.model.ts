import mongoose, { Schema, Types, model } from 'mongoose';
import { IBooking, BookingStatus, PaymentStatus } from './booking.interface';
import { string } from 'zod/v4/classic/coerce.cjs';

const BookingSchema= new Schema(
  {
    tourist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    requestedDate: { type: String, required: true },
    requestedTime: { type: String },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    numberOfPeople: { type: Number },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    specialRequests: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>('Booking', BookingSchema);
