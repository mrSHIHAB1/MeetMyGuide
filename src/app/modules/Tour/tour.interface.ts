import { Types } from 'mongoose';

export enum TourStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface ITour {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  itinerary?: string;
  fee: number;
  duration: number; // in hours (or any agreed unit)
  meetingPoint?: string;
  maxGroupSize?: number;
  images?: string[];
  guide?: Types.ObjectId; // reference to guide (optional)
  isDeleted?: boolean;
  status?: TourStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
