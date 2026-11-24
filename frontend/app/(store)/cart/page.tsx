"use client";
import Link from "next/link";
import { CartLine } from "@/components/cart/cart-line";
import { CouponForm } from "@/components/cart/coupon-form";
import { OrderSummary } from "@/components/cart/order-summary";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";

export default function CartPage() {
  const { ready, isAuthed } = useAuth();
  const { cart, isLoading } = useCart();

  if (ready && !isAuthed)
    return <div className="container-ff py-20"><EmptyState title="Sign in to see your cart" text="Your cart is saved to your account so it follows you across devices." href="/login?next=/cart" cta="Sign in" /></div>;
  if (!ready || isLoading) return <div className="container-ff py-12"><Skeleton className="h-64" /></div>;
  if (!cart?.items.length)
    return <div className="container-ff py-20"><EmptyState title="Your cart is empty" text="Find something that fits your space." href="/shop" cta="Start shopping" /></div>;

  return (
    <div className="container-ff py-12">
      <h1 className="mb-8 text-4xl">Your cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <ul>{cart.items.map((i) => <CartLine key={i.id} item={i} />)}</ul>
        <div className="h-fit lg:sticky lg:top-28">
          <OrderSummary cart={cart}>
            <CouponForm />
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-full")}>Checkout</Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
