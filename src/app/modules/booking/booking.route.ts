import { Router } from 'express';
import { BookingController } from './booking.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { createBookingZodSchema, updateBookingZodSchema, statusUpdateZodSchema } from './booking.validation';
import { Role } from '../user/user.interface';

const router = Router();

// Create booking (traveler requests)
router.post(
  '/create',
  validateRequest(createBookingZodSchema),
  BookingController.createBooking
);

// Get all bookings (admin only)
router.get('/all', checkAuth(Role.ADMIN), BookingController.getAllBookings);

// Get single booking
router.get('/:id', BookingController.getBooking);

// Get my bookings (traveler)
router.get('/traveler/my-bookings', checkAuth(Role.TOURIST), BookingController.getMyBookings);

// Get guide's bookings
router.get('/guide/my-bookings', checkAuth(Role.GUIDE), BookingController.getGuideBookings);

// Update booking details (traveler can update pending bookings)
router.patch(
  '/:id/update',
  validateRequest(updateBookingZodSchema),
  BookingController.updateBooking
);

// Guide accepts booking
router.patch('/:id/accept', checkAuth(Role.GUIDE), BookingController.acceptBooking);

// Guide declines booking
router.patch('/:id/decline', checkAuth(Role.GUIDE), BookingController.declineBooking);

// Mark booking as completed (guide)
router.patch('/:id/complete', checkAuth(Role.GUIDE), BookingController.completeBooking);

export const BookingRoutes = router;
