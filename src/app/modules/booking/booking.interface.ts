import { Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IBooking {
  _id?: Types.ObjectId;
  tourist: string; // reference to User (traveler)
  guide: string; // reference to User (guide)
  tour: string; // reference to Tour
  requestedDate: Date;
  requestedTime?: string; // e.g., "14:30"
  status: BookingStatus;
  numberOfPeople?: number;
  specialRequests?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
