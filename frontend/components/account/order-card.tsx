import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { statusTone } from "@/features/orders/status";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function OrderCard({ o }: { o: Order }) {
  return (
    <Link href={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white p-5 transition hover:border-ink">
      <div><p className="font-medium">#{o.order_number}</p><p className="text-sm text-muted">{formatDate(o.created_at)} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p></div>
      <div className="flex items-center gap-3"><Badge tone={statusTone(o.status)}>{o.status}</Badge><span className="font-semibold">{formatPrice(o.total_amount)}</span></div>
    </Link>
  );
}
