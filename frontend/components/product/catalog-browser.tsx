"use client";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { filtersFromParams } from "@/features/products/params";
import { Filters } from "./filters";
import { ProductGrid } from "./product-grid";

export function CatalogBrowser({ fixedCategory }: { fixedCategory?: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
    if (!("page" in patch)) next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const filters = filtersFromParams(sp, fixedCategory ? { category: fixedCategory } : {});
  const q = sp.get("q");

  return (
    <div className="container-ff grid gap-10 py-10 lg:grid-cols-[16rem_1fr]">
      <div>
        <Button variant="outline" size="sm" className="mb-4 lg:hidden" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={15} />Filters</Button>
        <div className={showFilters ? "block" : "hidden lg:block"}><Filters params={sp} onChange={update} hideCategory={!!fixedCategory} /></div>
      </div>
      <div>
        {q && <p className="mb-4 text-sm">Results for “<strong>{q}</strong>” <button className="ml-2 text-clay underline" onClick={() => update({ q: null })}>clear</button></p>}
        <ProductGrid filters={filters} onPage={(p) => update({ page: String(p) })} />
      </div>
    </div>
  );
}
