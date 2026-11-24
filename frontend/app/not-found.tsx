import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StoreShell } from "@/components/layout/store-shell";
export default function NotFound() {
  return (
    <StoreShell>
      <div className="container-ff py-28 text-center">
        <p className="eyebrow">404</p><h1 className="mt-3 text-5xl">This page folded away.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <Link href="/shop" className={buttonVariants({ className: "mt-8" })}>Back to the shop</Link>
      </div>
    </StoreShell>
  );
}
