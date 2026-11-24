import { paymentApi } from "@/lib/api/endpoints";
import type { PaymentInitiate } from "@/types/order";

declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void } } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error("Couldn't load the payment window. Check your connection."));
    document.body.appendChild(s);
  });
}

export type PayResult = "paid" | "cod" | "dismissed";

/** Opens the gateway widget for an already-created order and verifies the signature with the backend. */
export async function runPayment(orderId: string, provider: string, prefill: { name?: string; email?: string; contact?: string }): Promise<PayResult> {
  const init: PaymentInitiate = await paymentApi.initiate(orderId, provider);
  if (provider === "cod") return "cod";

  if (provider === "razorpay") {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    return new Promise<PayResult>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: init.key_id, order_id: init.provider_order_id, currency: init.currency,
        amount: Math.round(Number(init.amount) * 100), name: "FurnishFoldz", description: "Order payment",
        prefill, theme: { color: "#b4532a" },
        modal: { ondismiss: () => resolve("dismissed") },
        handler: async (r: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentApi.verify({ payment_id: init.payment_id, provider_payment_id: r.razorpay_payment_id, provider_signature: r.razorpay_signature });
            resolve("paid");
          } catch (e) { reject(e); }
        },
      });
      rzp.open();
    });
  }
  // The backend's Cashfree adapter creates the order but does not return a payment_session_id,
  // which Cashfree's hosted checkout needs. Fail loudly instead of silently doing nothing.
  throw new Error("Cashfree checkout needs a payment_session_id from the backend. Please use Razorpay or Cash on delivery for now.");
}
