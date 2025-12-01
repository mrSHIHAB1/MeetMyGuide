import { Router } from 'express';
import { TourController } from './tour.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTourZodSchema, updateTourZodSchema } from './tour.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

// Create a tour listing (guide or admin)
router.post('/create', validateRequest(createTourZodSchema), TourController.createTour);

// Get all tours
router.get('/', TourController.getAllTours);

// Get single tour
router.get('/:id', TourController.getTour);

// Update tour (guide or admin)
router.patch('/:id', validateRequest(updateTourZodSchema), TourController.updateTour);

// Deactivate (soft delete) a tour (guide or admin)
router.patch('/deactivate/:id', checkAuth(Role.GUIDE, Role.ADMIN), TourController.deactivateTour);

export const TourRoutes = router;
