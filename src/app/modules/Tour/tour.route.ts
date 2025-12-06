import { Router } from 'express';
import { TourController } from './tour.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTourZodSchema, updateTourZodSchema } from './tour.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { fileUploader } from '../../helpers/fileUpload';

const router = Router();

// Create a tour listing (guide or admin) with multiple images upload
router.post(
	'/create',
	fileUploader.upload.array('images', 8),
	// validateRequest(createTourZodSchema),
	TourController.createTour
);

// Get all tours
router.get('/', TourController.getAllTours);

// Get filtered tours
router.get('/filter', TourController.getAllToursByFilter);

// Get single tour
router.get('/:id', TourController.getTour);

// Update tour (guide or admin)
router.patch('/:id', fileUploader.upload.array('images', 8), validateRequest(updateTourZodSchema), TourController.updateTour);

// Deactivate (soft delete) a tour (guide or admin)
router.patch('/deactivate/:id',  TourController.deactivateTour);

export const TourRoutes = router;
