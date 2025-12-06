import mongoose, { Schema, model } from 'mongoose';
import { ITour, TourCategory, TourStatus } from './tour.interface';

const TourSchema: Schema<ITour> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    destination:{ type: String },
    itinerary: { type: String },
    fee: { type: Number, required: true },
    duration: { type: Number, required: true },
    meetingPoint: { type: String },
    maxGroupSize: { type: Number },
    images: { type: [String] },
     category: { type: String, enum: Object.values(TourCategory) ,default:TourCategory.ALL},
    guide: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(TourStatus), default: TourStatus.ACTIVE },
  },
  { timestamps: true }
);

export const Tour = model<ITour>('Tour', TourSchema);
