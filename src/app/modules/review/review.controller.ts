import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ReviewService } from './review.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Allow passing reviewer id (touristId/reviewerId) directly, otherwise fallback to token
  const { reviewerId, touristId, guideId, tourId, rating, comment } = req.body as any;

  let reviewer: any = null;
  if (reviewerId || touristId) {
    const id = reviewerId || touristId;
    reviewer = await User.findById(id);
    if (!reviewer) return sendResponse(res, { success: false, statusCode: httpStatus.NOT_FOUND, message: 'Reviewer (by id) not found', data: null });
  } else {
    const reviewerEmail = (req.user as any)?.email;
    if (reviewerEmail) {
      reviewer = await User.findOne({ email: reviewerEmail });
      if (!reviewer) return sendResponse(res, { success: false, statusCode: httpStatus.NOT_FOUND, message: 'Reviewer not found', data: null });
    }
  }

  if (!reviewer) {
    return sendResponse(res, { success: false, statusCode: httpStatus.BAD_REQUEST, message: 'Reviewer information required (provide reviewerId or authenticate)', data: null });
  }

  const created = await ReviewService.createReview({ reviewer: reviewer._id, guide: guideId, tour: tourId, rating, comment });
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: 'Review created', data: created });
});

const getReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const review = await ReviewService.getReviewById(id);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: 'Review retrieved', data: review });
});

const getReviewsByGuide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { guideId } = req.params;
  const reviews = await ReviewService.getReviewsByGuide(guideId);
  const avg = await ReviewService.getAverageRatingForGuide(guideId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: 'Guide reviews retrieved', data: reviews, meta: { avgRating: avg.avgRating, count: avg.count } });
});

const getReviewsByTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tourId } = req.params;
  const reviews = await ReviewService.getReviewsByTour(tourId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: 'Tour reviews retrieved', data: reviews });
});

const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // allow only reviewer or admin to update
  const reviewerEmail = (req.user as any)?.email;
  const user = await User.findOne({ email: reviewerEmail });
  const review = await ReviewService.getReviewById(id);
  if (!user) return sendResponse(res, { success: false, statusCode: httpStatus.UNAUTHORIZED, message: 'Not authenticated', data: null });
  if (review.reviewer.toString() !== user._id.toString() && (req.user as any)?.role !== 'ADMIN') {
    return sendResponse(res, { success: false, statusCode: httpStatus.FORBIDDEN, message: 'Not allowed to edit', data: null });
  }

  const updated = await ReviewService.updateReview(id, req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: 'Review updated', data: updated });
});

const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const reviewerEmail = (req.user as any)?.email;
  const user = await User.findOne({ email: reviewerEmail });
  const review = await ReviewService.getReviewById(id);
  if (!user) return sendResponse(res, { success: false, statusCode: httpStatus.UNAUTHORIZED, message: 'Not authenticated', data: null });
  if (review.reviewer.toString() !== user._id.toString() && (req.user as any)?.role !== 'ADMIN') {
    return sendResponse(res, { success: false, statusCode: httpStatus.FORBIDDEN, message: 'Not allowed to delete', data: null });
  }

  const deleted = await ReviewService.deleteReview(id);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: 'Review deleted', data: deleted });
});

export const ReviewController = {
  createReview,
  getReview,
  getReviewsByGuide,
  getReviewsByTour,
  updateReview,
  deleteReview,
};
