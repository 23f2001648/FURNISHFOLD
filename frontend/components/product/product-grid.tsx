"use client";
import { ErrorBox } from "@/components/ui/error-box";
import { EmptyState } from "@/components/ui/empty-state";
import { useProducts } from "@/hooks/use-products";
import type { ProductFilters } from "@/types/product";
import { ProductCard, ProductGridSkeleton } from "./product-card";
import { Pagination } from "./pagination";

export function ProductGrid({ filters, onPage, hidePager }: { filters: ProductFilters; onPage?: (p: number) => void; hidePager?: boolean }) {
  const { data, isLoading, error, isFetching } = useProducts(filters);
  if (isLoading) return <ProductGridSkeleton />;
  if (error) return <ErrorBox message={(error as Error).message} />;
  if (!data?.items.length) return <EmptyState title="Nothing matches yet" text="Try removing a filter or searching for something else." href="/shop" cta="Clear filters" />;
  return (
    <div className={isFetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
      <p className="mb-5 text-sm text-muted">{data.total} {data.total === 1 ? "piece" : "pieces"}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {!hidePager && onPage && <Pagination page={data.page} total={data.total_pages} onChange={onPage} />}
    </div>
  );
}
