import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import Stripe from 'stripe';
import { envVars } from '../../config/env';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY as string);

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentService.createCheckoutSession(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Checkout session created',
    data: {
      sessionId: result.sessionId,
      checkoutUrl: result.checkoutUrl,
      payment: result.payment,
    },
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId } = req.params;
  const payment = await PaymentService.confirmPayment(sessionId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment confirmed',
    data: payment,
  });
});

const getPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const payment = await PaymentService.getPayment(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrieved',
    data: payment,
  });
});

const getPaymentByBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  const payment = await PaymentService.getPaymentByBooking(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrieved',
    data: payment,
  });
});

const getPaymentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Session ID is required',
      data: null,
    });
  }
  const payment = await PaymentService.getPaymentBySession(sessionId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment status retrieved',
    data: payment,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      envVars.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const message = (err as Error).message;
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: `Webhook Error: ${message}`,
      data: null,
    });
  }

  // Handle the event
  const result = await PaymentService.handleWebhook(event);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Webhook processed',
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  confirmPayment,
  getPayment,
  getPaymentByBooking,
  getPaymentStatus,
  handleWebhook,
};
