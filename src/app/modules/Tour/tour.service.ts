import { ITour } from './tour.interface';
import { Tour } from './tour.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { fileUploader } from '../../helpers/fileUpload';
import { Types } from 'mongoose';

const createTour = async (payload: Partial<ITour>, files?: Express.Multer.File[]) => {
  // If files are provided, upload each to Cloudinary and collect URLs
  if (files && files.length > 0) {
    const uploadResults = await Promise.all(
      files.map((f) => fileUploader.uploadToCloudinary(f))
    );
    const urls = uploadResults.map((r) => (r as any)?.secure_url).filter(Boolean);
    if (urls.length) payload.images = urls as string[];
  }

  const created = await Tour.create(payload);
  return created;
};

export const getAllTours = async () => {
  const tours = await Tour.find({ isDeleted: false }).lean(); // plain JS objects
  const total = await Tour.countDocuments({ isDeleted: false });

  // Convert ObjectIds to strings
  const toursWithStringIds = tours.map((t) => ({
    ...t,
    _id: t._id.toString(),
    guide: t.guide ? t.guide.toString() : undefined,
    createdAt: t.createdAt?.toISOString(),
    updatedAt: t.updatedAt?.toISOString(),
  }));

  return { data: toursWithStringIds, meta: { total } };
};

/**
 * Get a single tour by ID (non-deleted)
 */
export const getTourById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Tour ID");
  }

  const tour = await Tour.findById(id).lean();
  if (!tour || tour.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }

  // Convert ObjectIds to strings
  const tourWithStringIds = {
    ...tour,
    _id: tour._id.toString(),
    guide: tour.guide ? tour.guide.toString() : undefined,
    createdAt: tour.createdAt?.toISOString(),
    updatedAt: tour.updatedAt?.toISOString(),
  };

  return tourWithStringIds;
};

const updateTour = async (id: string, payload: Partial<ITour>, files?: Express.Multer.File[]) => {
  // If new images uploaded, upload and append to existing images
  if (files && files.length > 0) {
    const uploadResults = await Promise.all(files.map((f) => fileUploader.uploadToCloudinary(f)));
    const urls = uploadResults.map((r) => (r as any)?.secure_url).filter(Boolean) as string[];
    if (urls.length) {
      // merge with any provided images in payload
      payload.images = Array.from(new Set([...(payload.images || []), ...urls]));
    }
  }

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
