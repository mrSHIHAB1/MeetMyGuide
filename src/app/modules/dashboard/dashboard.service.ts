import { Booking } from '../booking/booking.model';
import { User } from '../user/user.model';
import { Tour } from '../Tour/tour.model';
import { Payment } from '../payment/payment.model';
import { PaymentStatus } from '../payment/payment.interface';
import { Role } from '../user/user.interface';

export class DashboardService {
  static async getDashboardStats() {
    const totalBookingsPromise = Booking.countDocuments({ isDeleted: false });
    const totalToursPromise = Tour.countDocuments({ isDeleted: false });
    const totalTouristsPromise = User.countDocuments({ role: Role.TOURIST, isDeleted: false });
    const totalGuidesPromise = User.countDocuments({ role: Role.GUIDE, isDeleted: false });
    const totalAdminsPromise = User.countDocuments({ role: Role.ADMIN, isDeleted: false });

    const paymentsAggregatePromise = Payment.aggregate([
      { $match: { status: PaymentStatus.COMPLETED, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const [
      totalBookings,
      totalTours,
      totalTourists,
      totalGuides,
      totalAdmins,
      paymentsAgg,
    ] = await Promise.all([
      totalBookingsPromise,
      totalToursPromise,
      totalTouristsPromise,
      totalGuidesPromise,
      totalAdminsPromise,
      paymentsAggregatePromise,
    ]);

    const totalPaidCents = (paymentsAgg && paymentsAgg[0] && paymentsAgg[0].total) || 0;
    const totalPaid = totalPaidCents / 100; // convert cents to major currency units

    return {
      totalBookings,
      totalTours,
      totalTourists,
      totalGuides,
      totalAdmins,
      totalPaid,
      totalPaidCents,
    };
  }
}

export default DashboardService;
