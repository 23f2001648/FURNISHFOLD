"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { OrderCard } from "@/components/account/order-card";
import { useAuth } from "@/hooks/use-auth";
import { orderApi } from "@/lib/api/endpoints";

export default function AccountPage() {
  const { user } = useAuth();
  const orders = useQuery({ queryKey: ["orders"], queryFn: orderApi.list });
  return (
    <div className="space-y-8">
      <div><p className="eyebrow">My account</p><h1 className="mt-1 text-4xl">Hello, {user?.name.split(" ")[0]}</h1><p className="text-muted">{user?.email}</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Orders", "/account/orders"], ["Addresses", "/account/addresses"], ["Wishlist", "/account/wishlist"]].map(([l, h]) => (
          <Link key={h} href={h} className="rounded-card border border-line bg-white p-5 transition hover:border-ink">{l} →</Link>
        ))}
      </div>
      <section><h2 className="mb-4 text-2xl">Recent orders</h2>
        {orders.data?.length ? <div className="space-y-3">{orders.data.slice(0, 3).map((o) => <OrderCard key={o.id} o={o} />)}</div> : <p className="text-sm text-muted">No orders yet.</p>}
      </section>
    </div>
  );
}
