import mongoose, { Schema, model } from 'mongoose';
import { ITour, TourStatus } from './tour.interface';

const TourSchema: Schema<ITour> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    itinerary: { type: String },
    fee: { type: Number, required: true },
    duration: { type: Number, required: true },
    meetingPoint: { type: String },
    maxGroupSize: { type: Number },
    images: { type: [String] },
   guide: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(TourStatus), default: TourStatus.ACTIVE },
  },
  { timestamps: true }
);

export const Tour = model<ITour>('Tour', TourSchema);
