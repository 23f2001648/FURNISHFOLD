import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-ff grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow">Foldable · Compact · Considered</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">Furniture that folds into your life.</h1>
          <p className="mt-5 max-w-md text-lg text-muted">Study desks, laptop tables and kids’ tables that open up when you need them and disappear when you don’t.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>Shop all<ArrowRight size={18} /></Link>
            <Link href="/shop?space=compact" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>For small spaces</Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-[2.5rem] bg-oak/40" />
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full p-10 text-ink" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M25 80h150M35 80l-8 80M165 80l8 80M60 80l28 80M140 80l-28 80" /><path d="M88 160h24" className="text-clay" stroke="#b4532a" /><rect x="70" y="52" width="60" height="28" rx="3" stroke="#b4532a" />
          </svg>
        </div>
      </div>
    </section>
  );
}
