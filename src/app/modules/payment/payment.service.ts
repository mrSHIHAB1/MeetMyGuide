import Stripe from 'stripe';
import { IPayment, PaymentStatus } from './payment.interface';
import { Payment } from './payment.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY as string);

const createCheckoutSession = async (payload: {
  bookingId: string;
  tourId: string;
  amount: number; 
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
}) => {
  const {
    bookingId,
    tourId,
    amount,
    currency = 'bdt',
    successUrl,
    cancelUrl,
  } = payload;

  
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `Tour Booking - ${tourId}`,
            description: `Payment for booking ${bookingId}`,
          },
          unit_amount: amount * 100, 
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url:
      successUrl ||
      `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:
      cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      bookingId: bookingId.toString(),
      tourId: tourId.toString(),
      amount: amount.toString(),     
      currency: currency.toString(),
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};



const confirmPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, 'Session not found');
  }

  if (session.payment_status !== 'paid') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment not completed'
    );
  }

  const metadata = session.metadata;

  if (
    !metadata ||
    !metadata.bookingId ||
    !metadata.tourId ||
    !metadata.amount ||
    !metadata.currency
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid payment metadata'
    );
  }

  const amount = Number(metadata.amount);

  if (isNaN(amount) || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid amount value'
    );
  }

  const existingPayment = await Payment.findOne({
    booking: metadata.bookingId,
  });

  if (existingPayment) {
    return existingPayment;
  }

  const payment = await Payment.create({
    booking: metadata.bookingId,
    tour: metadata.tourId,
    amount,
    currency: metadata.currency,
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent as string,
    status: PaymentStatus.COMPLETED,
    paidAt: new Date(),
  });

  return payment.populate(['booking', 'tour']);
};



const getPayment = async (id: string) => {
  const payment = await Payment.findById(id).populate(['booking', 'tour']);
  if (!payment || payment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  return payment;
};

const getPaymentByBooking = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId, isDeleted: false }).populate(['booking', 'tour']);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found for this booking');
  }
  return payment;
};

const getPaymentBySession = async (sessionId: string) => {
  const payment = await Payment.findOne({ stripeSessionId: sessionId, isDeleted: false }).populate(['booking', 'tour']);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  return payment;
};

const handleWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (payment) {
        payment.status = PaymentStatus.COMPLETED;
        payment.paidAt = new Date();
        payment.stripePaymentIntentId = session.payment_intent as string;
        await payment.save();
      }
      return payment;
    }
    case 'charge.failed': {
      const charge = event.data.object as Stripe.Charge;
      const payment = await Payment.findOne({ stripePaymentIntentId: charge.payment_intent });
      if (payment) {
        payment.status = PaymentStatus.FAILED;
        await payment.save();
      }
      return payment;
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const payment = await Payment.findOne({ stripePaymentIntentId: charge.payment_intent });
      if (payment) {
        payment.status = PaymentStatus.CANCELLED;
        await payment.save();
      }
      return payment;
    }
    default:
      return null;
  }
};

export const PaymentService = {
  createCheckoutSession,
  confirmPayment,
  getPayment,
  getPaymentByBooking,
  getPaymentBySession,
  handleWebhook,
};
