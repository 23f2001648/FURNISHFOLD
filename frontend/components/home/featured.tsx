"use client";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
export function Featured() {
  return (
    <section className="container-ff py-12">
      <div className="mb-6 flex items-end justify-between"><h2 className="text-3xl">New arrivals</h2><Link href="/shop" className="text-sm text-clay hover:underline">Shop all</Link></div>
      <ProductGrid filters={{ page: 1, page_size: 8 }} hidePager />
    </section>
  );
}
