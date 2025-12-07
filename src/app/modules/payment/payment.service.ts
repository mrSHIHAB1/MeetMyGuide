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
  const { bookingId, tourId, amount, currency = 'usd', successUrl, cancelUrl } = payload;

  // Create Stripe checkout session
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
          unit_amount: amount, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl || `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      bookingId,
      tourId,
    },
  });

  // Save payment record with pending status
  const payment = await Payment.create({
    booking: bookingId,
    tour: tourId,
    amount,
    currency,
    stripeSessionId: session.id,
    status: PaymentStatus.PENDING,
    metadata: {
      sessionId: session.id,
    },
  });

  return {
    payment,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmPayment = async (sessionId: string) => {
  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, 'Session not found');
  }

  // Find payment record
  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  // Update payment status based on session payment status
  if (session.payment_status === 'paid') {
    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    payment.stripePaymentIntentId = session.payment_intent as string;
    await payment.save();
  } else if (session.payment_status === 'unpaid') {
    payment.status = PaymentStatus.PENDING;
    await payment.save();
  }

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
