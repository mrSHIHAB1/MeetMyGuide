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
  const bookings = await Booking.find({ isDeleted: false })
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  const total = await Booking.countDocuments({ isDeleted: false });
  return { data: bookings, meta: { total } };
};

const getBookingById = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  if (!booking || booking.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const getBookingsByTraveler = async (travelerId: string) => {
  const bookings = await Booking.find({ tourist: travelerId, isDeleted: false })
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  const total = await Booking.countDocuments({ tourist: travelerId, isDeleted: false });
  return { data: bookings, meta: { total } };
};

const getBookingsByGuide = async (guideId: string, status?: string) => {
  const query: any = { guide: guideId, isDeleted: false };

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('tourist', 'name email phone')
    .populate('tour', 'title price');
  const total = await Booking.countDocuments(query);
  return { data: bookings, meta: { total } };
};

const acceptBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status: BookingStatus.CONFIRMED },
    { new: true }
  )
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
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
  )
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
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
  )
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const updateBooking = async (id: string, payload: Partial<IBooking>) => {
  const updated = await Booking.findByIdAndUpdate(id, payload, { new: true })
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return updated;
};

const deleteBooking = async (id: string) => {
  const booking = await Booking.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return booking;
};

const getBookingsByTour = async (tourId: string) => {
  const bookings = await Booking.find({ tour: tourId, isDeleted: false })
    .populate('tourist', 'name email phone')
    .populate('guide', 'name email phone')
    .populate('tour', 'title price');
  const total = await Booking.countDocuments({ tour: tourId, isDeleted: false });
  return { data: bookings, meta: { total } };
};
export const getFilteredBookingsService = async (filters?: Record<string, any>) => {
  const query: any = { isDeleted: false };

  // Apply filters
  if (filters?.status) query.status = filters.status;
  if (filters?.guideId) query.guide = filters.guideId;
  if (filters?.touristId) query.tourist = filters.touristId;

  // Search by tourist name or tour title
  if (filters?.searchTerm) {
    query.$or = [
      { 'tour.title': { $regex: filters.searchTerm, $options: 'i' } },
      { 'tourist.name': { $regex: filters.searchTerm, $options: 'i' } },
    ];
  }

  const bookings = await Booking.find(query)
    .populate("tourist", "name email phone")
    .populate("guide", "name email phone")
    .populate("tour", "title fee");

  const total = await Booking.countDocuments(query);

  return { data: bookings, meta: { total } };
};
const getMostBookedTours = async () => {
  const result = await Booking.aggregate([
    {
      $match: {
        isDeleted: false,
      // or "ACTIVE"
      }
    },
    {
      $group: {
        _id: "$tour",              // group by tour
        totalBookings: { $sum: 1 } // count bookings
      }
    },
    {
      $sort: { totalBookings: -1 }
    },
    {
      $limit: 5 // top 5 tours
    },
    {
      $project: {
        _id: 0,
        tour: "$_id",
        totalBookings: 1
      }
    }
  ]);

  return result;
};

export const BookingService = {
  getMostBookedTours,
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
  getBookingsByTour,
  getFilteredBookingsService 
};
