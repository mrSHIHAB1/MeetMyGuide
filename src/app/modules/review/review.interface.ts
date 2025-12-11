import { Types } from 'mongoose';

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IReview {
  _id?: Types.ObjectId;
  reviewer: Types.ObjectId; // traveler user id
  guide: Types.ObjectId; // guide user id
  tour?: Types.ObjectId; // optional tour id
  rating: number; // 1..5
  comment?: string;
  status?: ReviewStatus;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
