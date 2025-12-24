import { Router } from 'express';
import { BookingController, getFilteredBookings } from './booking.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { createBookingZodSchema, updateBookingZodSchema, statusUpdateZodSchema } from './booking.validation';
import { Role } from '../user/user.interface';

const router = Router();
router.get('/most-booked-tours', BookingController.getMostBookedTours);
// Create booking (traveler requests)
router.post(
  '/create',
 
  BookingController.createBooking
);
router.get("/filtered", getFilteredBookings);
router.get('/all', BookingController.getAllBookings);
router.get('/:id', BookingController.getBooking);

router.get('/traveler/my-bookings', BookingController.getMyBookings);
router.get('/tour/:tourId', BookingController.getBookingsByTourId);

router.get('/guide/my-bookings', BookingController.getGuideBookings);
router.patch(
  '/:id/update',
  BookingController.updateBooking
);

router.patch('/:id/accept',  BookingController.acceptBooking);

router.patch('/:id/decline',  BookingController.declineBooking);

router.patch('/:id/complete',  BookingController.completeBooking);

router.delete('/:id', BookingController.deleteBooking);

export const BookingRoutes = router;
