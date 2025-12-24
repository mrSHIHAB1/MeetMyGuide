import { Router } from 'express';
import { ReviewController } from './review.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createReviewZodSchema, updateReviewZodSchema } from './review.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const router = Router();


router.post('/create', ReviewController.createReview);

router.get('/create', (req, res) => {
	return sendResponse(res, { success: false, statusCode: httpStatus.METHOD_NOT_ALLOWED, message: 'Use POST /create to create a review', data: null });
});

router.get('/:id', ReviewController.getReview);


router.get('/guide/:guideId', ReviewController.getReviewsByGuide);

router.get('/tour/:tourId', ReviewController.getReviewsByTour);


router.patch('/:id', checkAuth(Role.TOURIST, Role.ADMIN), validateRequest(updateReviewZodSchema), ReviewController.updateReview);


router.delete('/:id', checkAuth(Role.TOURIST, Role.ADMIN), ReviewController.deleteReview);
router.get('/featured/guides', ReviewController.FeaturedGuides);
export const ReviewRoutes = router;
