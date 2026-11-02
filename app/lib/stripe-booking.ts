export async function expireStripeCheckoutSession(sessionId?: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !sessionId || !sessionId.startsWith("cs_")) return false;

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}/expire`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Idempotency-Key": `expire-checkout-${sessionId}`,
    },
  });

  if (response.ok) return true;
  const body = await response.text();
  // A session that was already completed/expired cannot be expired again.
  if (body.includes("checkout_session_completed") || body.includes("checkout_session_expired")) return false;
  throw new Error(`Stripe Checkout session expiry failed: ${body}`);
}
