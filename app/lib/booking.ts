// Fallback/base price kept for older UI imports.
export const ROOM_PRICE_THB = 550;
export const ROOM_COUNT = 5;
export const BOOKING_HOLD_MINUTES = 15;
/** Keep the single-array storage bounded until bookings move to per-record keys. */
export const MAX_STORED_BOOKINGS = 2000;
export const LONG_STAY_DISCOUNT_NIGHTS = 7;
export const LONG_STAY_DISCOUNT_RATE = 0.1;

export async function retryAsync<T>(operation: () => Promise<T>, attempts = 3, delayMs = 250) {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw lastError;
}

export function getStayDiscount(subtotal: number, nights: number) {
  const rate = nights >= LONG_STAY_DISCOUNT_NIGHTS ? LONG_STAY_DISCOUNT_RATE : 0;
  const discount = Math.round(subtotal * rate);
  return { rate, discount, total: subtotal - discount };
}

/** Environment kill switch for temporarily disabling public bookings. */
export function isBookingEnabled() {
  return process.env.BOOKING_ENABLED !== "false";
}

export const NIGHTLY_RATES_THB = {
  default: 550,
  january: 800,
  february: 700,
  march: 700,
  april: 500,
  may: 500,
  june: 500,
  july: 500,
  august: 500,
  september: 500,
  october: 600,
  november: 700,
  december: 800,
  newYear: 950,
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
export type RefundStatus = "pending" | "succeeded" | "failed";

export interface Booking {
  id: string;
  roomNumber: number;
  roomNumbers?: number[];
  rooms?: number;
  guestName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  policyAcceptedAt?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  subtotal?: number;
  discount?: number;
  discountRate?: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  holdUntil: string;
  receiptToken?: string;
  paymentReference?: string;
  stripeEventId?: string;
  refundStatus?: RefundStatus;
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

/**
 * Bound historical storage without ever dropping an active or paid booking.
 * If active bookings exceed the cap, keeping them is safer than risking an overbooking.
 */
export function compactBookings(bookings: Booking[], now = new Date()) {
  if (bookings.length <= MAX_STORED_BOOKINGS) return bookings;
  const isActive = (booking: Booking) => booking.bookingStatus !== "cancelled" &&
    (booking.paymentStatus === "paid" || new Date(booking.holdUntil) > now);
  const active = bookings.filter(isActive);
  const activeIds = new Set(active.map((booking) => booking.id));
  const historicalSlots = Math.max(0, MAX_STORED_BOOKINGS - active.length);
  const historical = bookings.filter((booking) => !activeIds.has(booking.id)).slice(-historicalSlots);
  const keepIds = new Set([...active, ...historical].map((booking) => booking.id));
  return bookings.filter((booking) => keepIds.has(booking.id));
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
