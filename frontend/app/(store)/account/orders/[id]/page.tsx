"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AddressBlock } from "@/components/account/address-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/ui/error-box";
import { Skeleton } from "@/components/ui/skeleton";
import { canCancel, ORDER_STEPS, statusTone } from "@/features/orders/status";
import { orderApi } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatPrice, titleCase } from "@/lib/utils/format";

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const placed = useSearchParams().get("placed");
  const order = useQuery({ queryKey: ["order", id], queryFn: () => orderApi.get(id) });
  const ships = useQuery({ queryKey: ["shipments", id], queryFn: () => orderApi.shipments(id) });
  const cancel = useMutation({
    mutationFn: () => orderApi.cancel(id),
    onSuccess: (o) => { qc.setQueryData(["order", id], o); qc.invalidateQueries({ queryKey: ["orders"] }); toast.success("Order cancelled"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (order.isLoading) return <Skeleton className="h-96" />;
  if (order.error) return <ErrorBox message={(order.error as Error).message} />;
  const o = order.data!;
  const step = ORDER_STEPS.indexOf(o.status);
  const row = "flex justify-between text-sm";

  return (
    <div className="space-y-8">
      {placed && <div className="flex items-center gap-3 rounded-card bg-green-50 p-5 text-green-800"><CheckCircle2 /><div><p className="font-medium">Thank you for your order!</p><p className="text-sm">We’ve sent the details to your email.</p></div></div>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-4xl">Order #{o.order_number}</h1><p className="text-muted">Placed {formatDate(o.created_at)}</p></div>
        <div className="flex gap-2"><Badge tone={statusTone(o.status)}>{o.status}</Badge><Badge tone={statusTone(o.payment_status)}>Payment {o.payment_status}</Badge></div>
      </div>

      {step >= 0 && o.status !== "cancelled" && (
        <ol className="grid grid-cols-5 gap-2">
          {ORDER_STEPS.map((s, i) => (
            <li key={s} className="space-y-2"><div className={cn("h-1.5 rounded-full", i <= step ? "bg-clay" : "bg-line")} /><p className={cn("text-xs", i <= step ? "font-medium" : "text-muted")}>{titleCase(s)}</p></li>
          ))}
        </ol>
      )}

      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="mb-3 text-xl">Items</h2>
          <ul className="divide-y divide-line">{o.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-medium">{i.product_title_snapshot}</p><p className="text-muted">{i.variant_label_snapshot} · Qty {i.quantity}</p></div><span>{formatPrice(i.line_total)}</span></li>
          ))}</ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4">
            <div className={row}><span className="text-muted">Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
            {Number(o.discount_amount) > 0 && <div className={row}><span className="text-muted">Discount</span><span>−{formatPrice(o.discount_amount)}</span></div>}
            <div className={row}><span className="text-muted">Shipping</span><span>{formatPrice(o.shipping_amount)}</span></div>
            <div className={row}><span className="text-muted">Tax</span><span>{formatPrice(o.tax_amount)}</span></div>
            <div className={cn(row, "text-base font-semibold")}><span>Total</span><span>{formatPrice(o.total_amount)}</span></div>
          </div>
        </section>
        <div className="space-y-6">
          <section className="rounded-card border border-line bg-white p-6"><h2 className="mb-3 text-xl">Shipping to</h2><AddressBlock a={o.shipping_address} /></section>
          <section className="rounded-card border border-line bg-white p-6">
            <h2 className="mb-3 text-xl">Tracking</h2>
            {ships.data?.length ? ships.data.map((s) => (
              <div key={s.id} className="text-sm"><p className="font-medium">{s.carrier} · {titleCase(s.status)}</p>{s.tracking_number && <p className="text-muted">AWB {s.tracking_number}</p>}
                {s.tracking_url && <a href={s.tracking_url} target="_blank" rel="noreferrer" className="text-clay underline">Track shipment</a>}</div>
            )) : <p className="text-sm text-muted">Tracking appears here once your order ships.</p>}
          </section>
        </div>
      </div>
      {canCancel(o.status) && <Button variant="outline" loading={cancel.isPending} onClick={() => confirm("Cancel this order?") && cancel.mutate()}>Cancel order</Button>}
    </div>
  );
}
