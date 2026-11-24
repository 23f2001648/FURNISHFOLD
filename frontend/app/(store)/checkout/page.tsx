"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AddressBlock } from "@/components/account/address-card";
import { AddressForm } from "@/components/account/address-form";
import { OrderSummary } from "@/components/cart/order-summary";
import { PaymentOptions } from "@/components/checkout/payment-options";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/features/auth/auth-guard";
import { runPayment } from "@/features/checkout/pay";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { orderApi, userApi } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils/cn";

function Checkout() {
  const { cart, isLoading } = useCart();
  const { user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: userApi.addresses });
  const [picked, setPicked] = useState<string>();
  const [adding, setAdding] = useState(false);
  const [provider, setProvider] = useState("razorpay");
  const [note, setNote] = useState("");

  const addAddr = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: (a) => { qc.invalidateQueries({ queryKey: ["addresses"] }); setPicked(a.id); setAdding(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const addressId = picked ?? addresses.data?.find((a) => a.is_default)?.id ?? addresses.data?.[0]?.id;

  const place = useMutation({
    mutationFn: async () => {
      const order = await orderApi.place({ shipping_address_id: addressId!, payment_provider: provider, coupon_code: cart?.coupon_code, customer_note: note || undefined });
      qc.invalidateQueries({ queryKey: ["cart"] });
      try {
        const res = await runPayment(order.id, provider, { name: user?.name, email: user?.email, contact: user?.phone ?? undefined });
        return { order, res };
      } catch (e) {
        // The order exists (stock is reserved) — send them to it so they can retry/cancel instead of losing it.
        toast.error((e as Error).message);
        return { order, res: "failed" as const };
      }
    },
    onSuccess: ({ order, res }) => {
      if (res === "paid" || res === "cod") toast.success("Order placed — thank you!");
      else toast.message("Your order is saved but payment isn’t complete yet.");
      qc.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/account/orders/${order.id}?placed=1`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || addresses.isLoading) return <div className="container-ff py-12"><Skeleton className="h-96" /></div>;
  if (!cart?.items.length) return <div className="container-ff py-20"><EmptyState title="Nothing to check out" href="/shop" cta="Shop now" /></div>;

  const list = addresses.data ?? [];
  return (
    <div className="container-ff py-12">
      <h1 className="mb-8 text-4xl">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-2xl">1. Delivery address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((a) => (
                <label key={a.id} className={cn("cursor-pointer rounded-xl border p-4", addressId === a.id ? "border-ink bg-white" : "border-line hover:border-ink/50")}>
                  <input type="radio" name="addr" className="sr-only" checked={addressId === a.id} onChange={() => setPicked(a.id)} /><AddressBlock a={a} />
                </label>
              ))}
              {!adding && <button onClick={() => setAdding(true)} className="flex min-h-24 items-center justify-center gap-2 rounded-xl border border-dashed border-line text-sm text-muted hover:border-ink hover:text-ink"><Plus size={16} />Add new address</button>}
            </div>
            {(adding || list.length === 0) && <div className="mt-5 rounded-card border border-line bg-white p-5"><AddressForm onSubmit={(d) => addAddr.mutate({ ...d, line2: d.line2 || null })} loading={addAddr.isPending} onCancel={list.length ? () => setAdding(false) : undefined} /></div>}
          </section>
          <section><h2 className="mb-4 text-2xl">2. Payment</h2><PaymentOptions value={provider} onChange={setProvider} /></section>
          <section><h2 className="mb-4 text-2xl">3. Note (optional)</h2><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Delivery instructions, gift message…" /></section>
        </div>
        <div className="h-fit lg:sticky lg:top-28">
          <OrderSummary cart={cart}>
            <Button size="lg" className="mt-2 w-full" disabled={!addressId} loading={place.isPending} onClick={() => place.mutate()}>
              {provider === "cod" ? "Place order" : "Pay & place order"}
            </Button>
            {!addressId && <p className="text-xs text-muted">Add a delivery address to continue.</p>}
            <Link href="/cart" className="block text-center text-sm text-muted hover:text-ink">Edit cart</Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
export default function CheckoutPage() { return <AuthGuard><Checkout /></AuthGuard>; }
