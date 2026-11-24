"use client";
import { ProductCard, ProductGridSkeleton } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useProducts } from "@/hooks/use-products";
import { useWishlist } from "@/features/wishlist/use-wishlist";

// The wishlist endpoint only returns product ids, so we resolve them against the catalogue.
export default function WishlistPage() {
  const { ids, isLoading } = useWishlist();
  const products = useProducts({ page: 1, page_size: 100 });
  const saved = products.data?.items.filter((p) => ids.has(p.id)) ?? [];
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Wishlist</h1>
      {isLoading || products.isLoading ? <ProductGridSkeleton n={4} /> : saved.length === 0 ? <EmptyState title="Nothing saved yet" text="Tap the heart on any product to keep it here." href="/shop" cta="Browse furniture" /> :
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{saved.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  );
}
