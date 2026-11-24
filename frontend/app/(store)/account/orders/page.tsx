"use client";
import { useQuery } from "@tanstack/react-query";
import { OrderCard } from "@/components/account/order-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { orderApi } from "@/lib/api/endpoints";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: orderApi.list });
  return (
    <div className="space-y-5">
      <h1 className="text-4xl">Orders</h1>
      {isLoading && <Skeleton className="h-24" />}
      {data?.length === 0 && <EmptyState title="No orders yet" text="When you place an order it will show up here." href="/shop" cta="Shop now" />}
      <div className="space-y-3">{data?.map((o) => <OrderCard key={o.id} o={o} />)}</div>
    </div>
  );
}
