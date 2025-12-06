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

export const getMyBookings = catchAsync(async (req, res) => {
  // Decode user from accessToken cookie
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Access token missing",
      data: null,
    });
  }

  let decoded: any;
  try {
    decoded = require("jsonwebtoken").verify(accessToken, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid token",
      data: null,
    });
  }

  const travelerId = decoded.userId || decoded.id; // depends on what your token uses
  console.log("Decoded traveler ID:", travelerId);
  if (!travelerId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Traveler ID not found in token",
      data: null,
    });
  }

  const result = await BookingService.getBookingsByTraveler(travelerId);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved",
    data: result.data,
    meta: result.meta,
  });
});



const getGuideBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Decode user from accessToken cookie
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Access token missing",
      data: null,
    });
  }

  let decoded: any;
  try {
    decoded = require("jsonwebtoken").verify(accessToken, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid token",
      data: null,
    });
  }

  const guideId = decoded.userId || decoded.id;
  console.log("Decoded guide ID:", guideId);
  if (!guideId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Guide ID not found in token",
      data: null,
    });
  }

  // Get status filter from query params
  const status = req.query.status as string | undefined;

  const result = await BookingService.getBookingsByGuide(guideId, status);

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

const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const booking = await BookingService.deleteBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking deleted (soft)',
    data: booking,
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
  deleteBooking,
};
