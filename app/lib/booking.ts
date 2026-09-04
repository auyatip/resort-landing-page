// Fallback/base price kept for older UI imports.
export const ROOM_PRICE_THB = 550;
export const ROOM_COUNT = 5;
export const BOOKING_HOLD_MINUTES = 15;

/** Environment kill switch for temporarily disabling public bookings. */
export function isBookingEnabled() {
  return process.env.BOOKING_ENABLED !== "false";
}

export const NIGHTLY_RATES_THB = {
  default: 550,
  january: 850,
  february: 850,
  march: 700,
  april: 550,
  may: 550,
  june: 550,
  july: 550,
  august: 550,
  september: 500,
  october: 750,
  november: 850,
  december: 900,
  newYear: 990,
} as const;

/** Returns the rate for the night beginning on a YYYY-MM-DD date. */
export function getNightlyRate(dateString: string) {
  const date = new Date(dateString + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return NIGHTLY_RATES_THB.default;
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  if (month === 12 && day >= 30) return NIGHTLY_RATES_THB.newYear;
  if (month === 1 && day <= 2) return NIGHTLY_RATES_THB.newYear;
  if (month === 1) return NIGHTLY_RATES_THB.january;
  if (month === 2) return NIGHTLY_RATES_THB.february;
  if (month === 3) return NIGHTLY_RATES_THB.march;
  if (month === 9) return NIGHTLY_RATES_THB.september;
  if (month === 10) return NIGHTLY_RATES_THB.october;
  if (month === 11) return NIGHTLY_RATES_THB.november;
  if (month === 12) return NIGHTLY_RATES_THB.december;
  return NIGHTLY_RATES_THB.default;
}

export function getStayPricing(checkIn: string, checkOut: string) {
  const nights = getNights(checkIn, checkOut);
  const rates: number[] = [];
  const start = new Date(checkIn + "T00:00:00Z");
  for (let index = 0; index < nights; index += 1) {
    const night = new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10);
    rates.push(getNightlyRate(night));
  }
  return { nights, rates, total: rates.reduce((sum, rate) => sum + rate, 0) };
}

export function getStayPricingWithRates(checkIn: string, checkOut: string, ratesConfig: typeof NIGHTLY_RATES_THB & { daily?: Record<string, number>; weekend?: Record<keyof typeof NIGHTLY_RATES_THB, number> }) {
  const nights = getNights(checkIn, checkOut);
  const rates: number[] = [];
  const start = new Date(checkIn + "T00:00:00Z");
  for (let index = 0; index < nights; index += 1) {
    const night = new Date(start.getTime() + index * 86400000);
    const dateKey = night.toISOString().slice(0, 10);
    if (ratesConfig.daily?.[dateKey]) { rates.push(ratesConfig.daily[dateKey]); continue; }
    const month = night.getUTCMonth() + 1;
    const day = night.getUTCDate();
    const key = month === 12 && day >= 30 || month === 1 && day <= 2 ? "newYear" : (["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"] as const)[month - 1];
    const isWeekend = night.getUTCDay() === 0 || night.getUTCDay() === 6;
    rates.push(isWeekend && ratesConfig.weekend?.[key] ? ratesConfig.weekend[key] : ratesConfig[key]);
  }
  return { nights, rates, total: rates.reduce((sum, rate) => sum + rate, 0) };
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Booking {
  id: string;
  roomNumber: number;
  roomNumbers?: number[];
  rooms?: number;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  holdUntil: string;
  paymentReference?: string;
  adminEmailSentAt?: string;
  latePayment?: boolean;
}

export interface RoomClosure {
  id: string;
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  note?: string;
}

export function getNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

export function isOverlapping(a: Booking, checkIn: string, checkOut: string) {
  const active = a.bookingStatus !== "cancelled" &&
    (a.paymentStatus === "paid" || new Date(a.holdUntil) > new Date());
  return active && a.checkIn < checkOut && a.checkOut > checkIn;
}

export function expireUnpaidBookings(bookings: Booking[], now = new Date()) {
  let changed = false;
  const updated = bookings.map((booking) => {
    if (booking.bookingStatus === "pending" && booking.paymentStatus === "pending" && new Date(booking.holdUntil) <= now) {
      changed = true;
      return { ...booking, bookingStatus: "cancelled" as const, paymentStatus: "failed" as const };
    }
    return booking;
  });
  return { bookings: updated, changed };
}

export function getAvailableRoomNumbers(bookings: Booking[], checkIn: string, checkOut: string, openRooms = Array.from({ length: ROOM_COUNT }, (_, index) => index + 1), closures: RoomClosure[] = []) {
  const occupied = new Set(
    bookings
      .filter((booking) => isOverlapping(booking, checkIn, checkOut))
      .flatMap((booking) => booking.roomNumbers?.length ? booking.roomNumbers : [booking.roomNumber])
  );
  closures.filter((closure) => closure.checkIn < checkOut && closure.checkOut > checkIn).forEach((closure) => occupied.add(closure.roomNumber));
  return openRooms.filter((room) => !occupied.has(room));
}

export function getAvailableRoomNumber(bookings: Booking[], checkIn: string, checkOut: string, openRooms = Array.from({ length: ROOM_COUNT }, (_, index) => index + 1), closures: RoomClosure[] = []) {
  return getAvailableRoomNumbers(bookings, checkIn, checkOut, openRooms, closures)[0] || null;
}
