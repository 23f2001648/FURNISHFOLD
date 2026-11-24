"use client";
import { useState } from "react";
import { ShoppingBag, Truck, ShieldCheck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quantity } from "@/components/ui/quantity";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { discountPct, formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/product";
import { WishlistButton } from "./wishlist-button";

export function PurchasePanel({ product }: { product: Product }) {
  const variants = product.variants.filter((v) => v.is_active);
  const [vid, setVid] = useState(variants[0]?.id);
  const [qty, setQty] = useState(1);
  const { addToCart, add } = useCart();
  const v = variants.find((x) => x.id === vid);
  const price = v?.price ?? product.base_price;
  const off = v ? discountPct(v.price, v.compare_at_price) : 0;
  const stock = v?.quantity_available ?? 0;
  const label = (x: typeof variants[number]) => [x.color, x.size].filter(Boolean).join(" · ") || x.sku;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold">{formatPrice(price)}</span>
        {v?.compare_at_price && off > 0 && <><span className="text-muted line-through">{formatPrice(v.compare_at_price)}</span><Badge tone="success">{off}% off</Badge></>}
      </div>
      <p className="-mt-4 text-xs text-muted">Inclusive of taxes where applicable.</p>

      {variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((x) => (
              <button key={x.id} onClick={() => { setVid(x.id); setQty(1); }} disabled={x.quantity_available < 1}
                className={cn("rounded-full border px-4 py-2 text-sm disabled:line-through disabled:opacity-40", x.id === vid ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink")}>
                {label(x)}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={cn("text-sm font-medium", stock === 0 ? "text-red-600" : stock <= 5 ? "text-amber-700" : "text-sage")}>
        {!v ? "Currently unavailable" : stock === 0 ? "Out of stock" : stock <= 5 ? `Only ${stock} left` : "In stock"}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Quantity value={qty} onChange={setQty} max={Math.min(20, Math.max(stock, 1))} />
        <Button size="lg" className="flex-1" disabled={!v || stock === 0} loading={add.isPending} onClick={() => v && addToCart(v.id, qty)}>
          <ShoppingBag size={18} />Add to cart
        </Button>
        <WishlistButton productId={product.id} className="size-12 border border-line" />
      </div>

      <ul className="grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-3">
        <li className="flex items-center gap-2"><Truck size={18} className="text-clay" />Delivered to your door</li>
        <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-clay" />Quality checked</li>
        <li className="flex items-center gap-2"><Undo2 size={18} className="text-clay" />Easy support</li>
      </ul>
    </div>
  );
}
