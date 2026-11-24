"use client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-products";

export function CategoryStrip() {
  const { data, isLoading } = useCategories();
  return (
    <section className="container-ff py-12">
      <div className="mb-6 flex items-end justify-between"><h2 className="text-3xl">Shop by category</h2><Link href="/shop" className="text-sm text-clay hover:underline">View all</Link></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {data?.map((c, i) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="group flex h-24 items-center justify-between rounded-card border border-line bg-white px-5 transition hover:border-ink">
            <span className="font-display text-lg">{c.name}</span><span className="text-xs text-muted group-hover:text-clay">0{i + 1} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
