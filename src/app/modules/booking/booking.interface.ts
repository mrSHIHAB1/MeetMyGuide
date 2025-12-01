import { Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IBooking {
  _id?: Types.ObjectId;
  traveler: Types.ObjectId; // reference to User (traveler)
  guide: Types.ObjectId; // reference to User (guide)
  tour: Types.ObjectId; // reference to Tour
  requestedDate: Date;
  requestedTime?: string; // e.g., "14:30"
  status: BookingStatus;
  numberOfPeople?: number;
  specialRequests?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
