import { Router, raw } from 'express';
import { PaymentController } from './payment.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCheckoutSessionZodSchema } from './payment.validation';
import bodyParser from 'body-parser';

const router = Router();


router.post(
  '/checkout-session',
  validateRequest(createCheckoutSessionZodSchema),
  PaymentController.createCheckoutSession
);

router.post('/confirm/:sessionId', PaymentController.confirmPayment);

router.get('/:id', PaymentController.getPayment);

router.get('/booking/:bookingId', PaymentController.getPaymentByBooking);

router.get('/status/check', PaymentController.getPaymentStatus);

export const PaymentRoutes = router;
