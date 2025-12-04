import mongoose, { Schema, model } from 'mongoose';
import { IBooking, BookingStatus } from './booking.interface';

const BookingSchema: Schema<IBooking> = new Schema(
  {
    traveler: { type: String},
    guide: { type: String},
    tour: { type: String},
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
