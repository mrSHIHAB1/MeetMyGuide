import { Router } from 'express';
import { TourController } from './tour.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTourZodSchema, updateTourZodSchema } from './tour.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { fileUploader } from '../../helpers/fileUpload';

const router = Router();

router.post(
	'/create',
	fileUploader.upload.array('images', 8),checkAuth(Role.ADMIN ,Role.GUIDE),
	validateRequest(createTourZodSchema),
	TourController.createTour
);

router.get('/', TourController.getAllTours);

router.get('/filter', TourController.getAllToursByFilter);

router.get('/filter/guide',  TourController.getFilteredToursByGuide);

router.get('/guide/:guideId', TourController.getToursByGuideId);

router.get('/:id', TourController.getTour);

router.patch('/:id', fileUploader.upload.array('images', 8),checkAuth(Role.ADMIN), validateRequest(updateTourZodSchema), TourController.updateTour);

router.patch('/deactivate/:id', TourController.deactivateTour);

export const TourRoutes = router;
