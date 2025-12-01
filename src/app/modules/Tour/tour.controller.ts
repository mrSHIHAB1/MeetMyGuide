import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { TourService } from './tour.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tour = await TourService.createTour(req.body);
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
  const updated = await TourService.updateTour(id, req.body);
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

export const TourController = {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deactivateTour,
};
