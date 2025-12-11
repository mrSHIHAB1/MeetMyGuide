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
 
  BookingController.createBooking
);

// Get all bookings (admin only)
router.get('/all', BookingController.getAllBookings);

// Get single booking
router.get('/:id', BookingController.getBooking);

// Get my bookings (traveler)
router.get('/traveler/my-bookings', BookingController.getMyBookings);

// Get bookings by tour id
router.get('/tour/:tourId', BookingController.getBookingsByTourId);

// Get guide's bookings
router.get('/guide/my-bookings', BookingController.getGuideBookings);

// Update booking details (traveler can update pending bookings)
router.patch(
  '/:id/update',
  BookingController.updateBooking
);

// Guide accepts booking
router.patch('/:id/accept',  BookingController.acceptBooking);

// Guide declines booking
router.patch('/:id/decline',  BookingController.declineBooking);

// Mark booking as completed (guide)
router.patch('/:id/complete',  BookingController.completeBooking);

// Delete booking (admin only) - soft delete
router.delete('/:id', BookingController.deleteBooking);

export const BookingRoutes = router;
