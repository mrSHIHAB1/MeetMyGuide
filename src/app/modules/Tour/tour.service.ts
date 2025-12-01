import { ITour } from './tour.interface';
import { Tour } from './tour.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';

const createTour = async (payload: Partial<ITour>) => {
  const created = await Tour.create(payload);
  return created;
};

const getAllTours = async () => {
  const tours = await Tour.find({ isDeleted: false });
  const total = await Tour.countDocuments({ isDeleted: false });
  return { data: tours, meta: { total } };
};

const getTourById = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour || tour.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const updated = await Tour.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  return updated;
};

const deactivateTour = async (id: string) => {
  const tour = await Tour.findByIdAndUpdate(id, { isDeleted: true, status: 'INACTIVE' }, { new: true });
  if (!tour) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  return tour;
};

export const TourService = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deactivateTour,
};
