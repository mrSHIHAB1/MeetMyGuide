import { IBooking, BookingStatus } from './booking.interface';
import { Booking } from './booking.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';

const createBooking = async (payload: Partial<IBooking>) => {
  const created = await Booking.create({
    ...payload,
    status: BookingStatus.PENDING,
  });
  return { data: created };
};

const getAllBookings = async () => {
  const bookings = await Booking.find({ isDeleted: false }).populate(['traveler', 'guide', 'tour']);
  const total = await Booking.countDocuments({ isDeleted: false });
  return { data: bookings, meta: { total } };
};

const getBookingById = async (id: string) => {
  const booking = await Booking.findById(id).populate(['traveler', 'guide', 'tour']);
  if (!booking || booking.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const getBookingsByTraveler = async (travelerId: string) => {
  const bookings = await Booking.find({ tourist: travelerId, isDeleted: false }).populate(['guide', 'tour']);
  const total = await Booking.countDocuments({ tourist: travelerId, isDeleted: false });
  return { data: bookings, meta: { total } };
};

const getBookingsByGuide = async (guideId: string, status?: string) => {
  const query: any = { guide: guideId, isDeleted: false };

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query).populate(['tourist', 'tour']);
  const total = await Booking.countDocuments(query);
  return { data: bookings, meta: { total } };
};

const acceptBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status: BookingStatus.CONFIRMED },
    { new: true }
  ).populate(['traveler', 'guide', 'tour']);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const declineBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status: BookingStatus.CANCELLED },
    { new: true }
  ).populate(['traveler', 'guide', 'tour']);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const completeBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status: BookingStatus.COMPLETED },
    { new: true }
  ).populate(['traveler', 'guide', 'tour']);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const updateBooking = async (id: string, payload: Partial<IBooking>) => {
  const updated = await Booking.findByIdAndUpdate(id, payload, { new: true }).populate(['traveler', 'guide', 'tour']);
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return updated;
};

const deleteBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).populate(['traveler', 'guide', 'tour']);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByTraveler,
  getBookingsByGuide,
  acceptBooking,
  declineBooking,
  completeBooking,
  updateBooking,
  deleteBooking,
};
