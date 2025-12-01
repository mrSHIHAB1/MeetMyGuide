import mongoose, { Schema, model } from 'mongoose';
import { IBooking, BookingStatus } from './booking.interface';

const BookingSchema: Schema<IBooking> = new Schema(
  {
    traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    requestedDate: { type: Date, required: true },
    requestedTime: { type: String },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    numberOfPeople: { type: Number },
    specialRequests: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>('Booking', BookingSchema);
