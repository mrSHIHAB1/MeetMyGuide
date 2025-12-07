import mongoose, { Schema, model } from 'mongoose';
import { IPayment, PaymentStatus } from './payment.interface';

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    amount: { type: Number, required: true }, // in cents
    currency: { type: String, default: 'usd' },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    paymentMethod: { type: String },
    paidAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', PaymentSchema);
