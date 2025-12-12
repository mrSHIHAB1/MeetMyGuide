import { Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export interface IBooking {
  _id?: Types.ObjectId;
  tourist: Types.ObjectId; // reference to User (traveler)
  guide: Types.ObjectId; // reference to User (guide)
  tour: Types.ObjectId; // reference to Tour
  requestedDate: string; // e.g., "2024-12-31"
  requestedTime?: string; // e.g., "14:30"
  status: BookingStatus;
  
  numberOfPeople?: number;
  specialRequests?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  paymentStatus?: PaymentStatus;
}
