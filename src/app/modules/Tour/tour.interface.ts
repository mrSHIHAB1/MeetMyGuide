import { Types } from 'mongoose';


export enum TourStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum TourCategory {
  FOOD = 'FOOD',
  ART = 'ART',
  ADVENTURE = 'ADVENTURE',
  CULTURE = 'CULTURE',
  NATURE = 'NATURE',
  HISTORY = 'HISTORY',
  SHOPPING = 'SHOPPING',
  NIGHTLIFE = 'NIGHTLIFE',
  ALL = 'ALL',
}
export interface ITour {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  destination?:string
  itinerary?: string;
  fee: number;
  category?: TourCategory
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
