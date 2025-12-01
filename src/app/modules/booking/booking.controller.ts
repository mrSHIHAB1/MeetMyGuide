import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BookingService } from './booking.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const booking = await BookingService.createBooking(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Booking created successfully (pending guide approval)',
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await BookingService.getAllBookings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved',
    data: result.data,
    meta: result.meta,
  });
});

const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const booking = await BookingService.getBookingById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking retrieved',
    data: booking,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const travelerEmail = (req.user as any)?.email;
  if (!travelerEmail) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Traveler email not found',
      data: null,
    });
  }
  // Get traveler ID from email (you may optimize this with caching or direct ID storage in token)
  const { User } = await import('../user/user.model');
  const traveler = await User.findOne({ email: travelerEmail });
  if (!traveler) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Traveler not found',
      data: null,
    });
  }
  const result = await BookingService.getBookingsByTraveler(traveler._id.toString());
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Your bookings retrieved',
    data: result.data,
    meta: result.meta,
  });
});

const getGuideBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const guideEmail = (req.user as any)?.email;
  if (!guideEmail) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Guide email not found',
      data: null,
    });
  }
  // Get guide ID from email
  const { User } = await import('../user/user.model');
  const guide = await User.findOne({ email: guideEmail });
  if (!guide) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Guide not found',
      data: null,
    });
  }
  const result = await BookingService.getBookingsByGuide(guide._id.toString());
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Guide bookings retrieved',
    data: result.data,
    meta: result.meta,
  });
});

const acceptBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const booking = await BookingService.acceptBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking confirmed',
    data: booking,
  });
});

const declineBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const booking = await BookingService.declineBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking declined',
    data: booking,
  });
});

const completeBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const booking = await BookingService.completeBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking marked complete',
    data: booking,
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updated = await BookingService.updateBooking(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking updated',
    data: updated,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getBooking,
  getMyBookings,
  getGuideBookings,
  acceptBooking,
  declineBooking,
  completeBooking,
  updateBooking,
};
