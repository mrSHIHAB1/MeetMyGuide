import { Router, raw } from 'express';
import { PaymentController } from './payment.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCheckoutSessionZodSchema } from './payment.validation';
import bodyParser from 'body-parser';

const router = Router();

// Webhook route must come first and use raw body (not parsed JSON)
router.post(
  '/webhook',
  raw({ type: 'application/json' }),
  PaymentController.handleWebhook
);

// Create checkout session
router.post(
  '/checkout-session',
  validateRequest(createCheckoutSessionZodSchema),
  PaymentController.createCheckoutSession
);

// Confirm payment (after Stripe redirect)
router.post('/confirm/:sessionId', PaymentController.confirmPayment);

// Get payment by ID
router.get('/:id', PaymentController.getPayment);

// Get payment by booking ID
router.get('/booking/:bookingId', PaymentController.getPaymentByBooking);

// Get payment status
router.get('/status/check', PaymentController.getPaymentStatus);

export const PaymentRoutes = router;
