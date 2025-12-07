import { Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface IPayment {
  _id?: Types.ObjectId;
  booking: Types.ObjectId; // reference to Booking
  tour: Types.ObjectId; // reference to Tour
  amount: number; // in cents
  currency?: string; // e.g., 'usd'
  stripeSessionId?: string; // Stripe checkout session ID
  stripePaymentIntentId?: string; // Stripe PaymentIntent ID
  status: PaymentStatus;
  paymentMethod?: string; // e.g., 'card', 'bank_transfer'
  paidAt?: Date;
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
