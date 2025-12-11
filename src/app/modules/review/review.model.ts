import mongoose, { Schema, model } from 'mongoose';
import { IReview, ReviewStatus } from './review.interface';

const ReviewSchema: Schema<IReview> = new Schema(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    status: { type: String, enum: Object.values(ReviewStatus), default: ReviewStatus.ACTIVE },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = model<IReview>('Review', ReviewSchema);
