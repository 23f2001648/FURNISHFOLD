import { formatPrice } from "@/lib/utils/format";
import type { Cart } from "@/types/cart";

export function OrderSummary({ cart, children }: { cart: Cart; children?: React.ReactNode }) {
  const row = "flex justify-between text-sm";
  return (
    <div className="space-y-3 rounded-card border border-line bg-white p-6">
      <h3 className="font-sans text-base font-semibold">Order summary</h3>
      <div className={row}><span className="text-muted">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
      {Number(cart.discount_amount) > 0 && <div className={row}><span className="text-sage">Discount{cart.coupon_code ? ` (${cart.coupon_code})` : ""}</span><span className="text-sage">−{formatPrice(cart.discount_amount)}</span></div>}
      <div className={row}><span className="text-muted">Shipping & tax</span><span className="text-muted">Calculated at order</span></div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
      {children}
    </div>
  );
}
