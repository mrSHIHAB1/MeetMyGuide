import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { TourService } from './tour.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const tour = await TourService.createTour(req.body, files);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Tour created successfully',
    data: tour,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await TourService.getAllTours();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tours retrieved',
    data: result.data,
    meta: result.meta,
  });
});

const getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const tour = await TourService.getTourById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour retrieved',
    data: tour,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const files = (req.files as Express.Multer.File[]) || [];
  const updated = await TourService.updateTour(id, req.body, files);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour updated',
    data: updated,
  });
});

const deactivateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const tour = await TourService.deactivateTour(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tour deactivated',
    data: tour,
  });
});
export const getAllToursByFilter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract filter parameters from query string
    const filters = {
      destination: req.query.destination as string | undefined,
      language: req.query.language as string | undefined,
      category: req.query.category as string | undefined,
      status: req.query.status as string | undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const result = await TourService.getAllToursByFilter(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tours retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
export const TourController = {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deactivateTour,
  getAllToursByFilter,
};
