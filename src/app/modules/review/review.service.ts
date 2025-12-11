import { Review } from './review.model';
import { IReview } from './review.interface';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';

const createReview = async (payload: Partial<IReview>) => {
  const review = await Review.create(payload);
  return review.populate(['reviewer', 'guide', 'tour']);
};

const getReviewById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid review id');
  const review = await Review.findById(id).populate(['reviewer', 'guide', 'tour']);
  if (!review || review.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  return review;
};

const getReviewsByGuide = async (guideId: string) => {
  const reviews = await Review.find({ guide: guideId, isDeleted: false, status: 'ACTIVE' }).populate(['reviewer', 'tour']);
  return reviews;
};

const getReviewsByTour = async (tourId: string) => {
  const reviews = await Review.find({ tour: tourId, isDeleted: false, status: 'ACTIVE' }).populate(['reviewer', 'guide']);
  return reviews;
};

const updateReview = async (id: string, payload: Partial<IReview>) => {
  const updated = await Review.findByIdAndUpdate(id, payload, { new: true }).populate(['reviewer', 'guide', 'tour']);
  if (!updated) throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  return updated;
};

const deleteReview = async (id: string) => {
  const deleted = await Review.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).populate(['reviewer', 'guide', 'tour']);
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  return deleted;
};

const getAverageRatingForGuide = async (guideId: string) => {
  const res = await Review.aggregate([
    { $match: { guide: new mongoose.Types.ObjectId(guideId), isDeleted: false, status: 'ACTIVE' } },
    { $group: { _id: '$guide', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  return res[0] || { _id: null, avgRating: 0, count: 0 };
};

export const ReviewService = {
  createReview,
  getReviewById,
  getReviewsByGuide,
  getReviewsByTour,
  updateReview,
  deleteReview,
  getAverageRatingForGuide,
};
