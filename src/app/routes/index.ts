import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { TourRoutes } from '../modules/Tour/tour.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';

const router = express.Router();
const moduleRoutes = [

    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/tour',
        route: TourRoutes
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/payment',
        route: PaymentRoutes
    }
    ,
    {
        path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/dashboard',
        route: DashboardRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;