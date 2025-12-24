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
  tourist: Types.ObjectId; 
  guide: Types.ObjectId; 
  tour: Types.ObjectId;
  requestedDate: string;
  requestedTime?: string; 
  status: BookingStatus;
  
  numberOfPeople?: number;
  specialRequests?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  paymentStatus?: PaymentStatus;
}
