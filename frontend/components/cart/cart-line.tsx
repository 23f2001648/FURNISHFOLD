"use client";
import { Trash2 } from "lucide-react";
import { Quantity } from "@/components/ui/quantity";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils/format";
import type { CartItem } from "@/types/cart";
import { ProductImage } from "@/components/product/product-image";

export function CartLine({ item }: { item: CartItem }) {
  const { update, remove } = useCart();
  const v = item.variant;
  const label = [v.color, v.size].filter(Boolean).join(" · ");
  return (
    <li className="flex gap-4 border-b border-line py-5">
      <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-cream"><ProductImage alt={v.sku} /></div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div><p className="font-medium">{v.sku}</p>{label && <p className="text-sm text-muted">{label}</p>}<p className="text-sm text-muted">{formatPrice(v.price)} each</p></div>
          <p className="font-semibold">{formatPrice(item.line_total)}</p>
        </div>
        <div className="flex items-center justify-between">
          <Quantity value={item.quantity} max={Math.min(20, v.quantity_available || 20)} disabled={update.isPending} onChange={(q) => update.mutate({ id: item.id, quantity: q })} />
          <button onClick={() => remove.mutate(item.id)} className="flex items-center gap-1 text-sm text-muted hover:text-red-600"><Trash2 size={15} />Remove</button>
        </div>
      </div>
    </li>
  );
}
