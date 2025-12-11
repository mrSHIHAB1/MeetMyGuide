import { Router } from 'express';
import { ReviewController } from './review.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createReviewZodSchema, updateReviewZodSchema } from './review.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const router = Router();

// Create a review (traveler only or by providing reviewer id)
router.post('/create', ReviewController.createReview);

// Helpful message for accidental GET requests to /create (prevents matching '/:id')
router.get('/create', (req, res) => {
	return sendResponse(res, { success: false, statusCode: httpStatus.METHOD_NOT_ALLOWED, message: 'Use POST /create to create a review', data: null });
});

// Get review by id
router.get('/:id', ReviewController.getReview);

// Get reviews for a guide and average
router.get('/guide/:guideId', ReviewController.getReviewsByGuide);

// Get reviews for a tour
router.get('/tour/:tourId', ReviewController.getReviewsByTour);

// Update review (author or admin)
router.patch('/:id', checkAuth(Role.TOURIST, Role.ADMIN), validateRequest(updateReviewZodSchema), ReviewController.updateReview);

// Delete review (author or admin)
router.delete('/:id', checkAuth(Role.TOURIST, Role.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;
