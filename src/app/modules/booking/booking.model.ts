import mongoose, { Schema, Types, model } from 'mongoose';
import { IBooking, BookingStatus } from './booking.interface';

const BookingSchema: Schema<IBooking> = new Schema(
  {
    tourist: { type: String, required: true },
    guide: { type: String, required: true },
    tour: { type: String, required: true },
    requestedDate: { type: Date},
    requestedTime: { type: String },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    numberOfPeople: { type: Number },
    specialRequests: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>('Booking', BookingSchema);
