import { writeBookingLog } from "./booking-log";

export async function expireStripeCheckoutSession(sessionId?: string, bookingId?: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !sessionId || !sessionId.startsWith("cs_")) {
    await writeBookingLog({
      event: "stripe.checkout.expire_ignored",
      actor: "system",
      status: "ignored",
      bookingId,
      metadata: { reason: !secret ? "stripe_not_configured" : "invalid_session_id" },
    });
    return false;
  }

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}/expire`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Idempotency-Key": `expire-checkout-${sessionId}`,
    },
  });

  if (response.ok) {
    await writeBookingLog({ bookingId, event: "stripe.checkout.expired", actor: "stripe", status: "success", metadata: { sessionId }, dedupeKey: `stripe-expired:${sessionId}` });
    return true;
  }
  const body = await response.text();
  // A session that was already completed/expired cannot be expired again.
  if (body.includes("checkout_session_completed") || body.includes("checkout_session_expired")) {
    await writeBookingLog({ bookingId, event: "stripe.checkout.expire_ignored", actor: "stripe", status: "ignored", metadata: { sessionId, reason: "already_completed_or_expired" }, dedupeKey: `stripe-expire-ignored:${sessionId}` });
    return false;
  }
  await writeBookingLog({ bookingId, event: "stripe.checkout.expire_failed", actor: "stripe", status: "failed", metadata: { sessionId, error: body.slice(0, 500) } });
  throw new Error(`Stripe Checkout session expiry failed: ${body}`);
}
