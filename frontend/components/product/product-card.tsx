import Link from "next/link";
import { Stars } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatPrice, titleCase } from "@/lib/utils/format";
import type { ProductListItem } from "@/types/product";
import { ProductImage } from "./product-image";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ p }: { p: ProductListItem }) {
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-cream">
        <div className="size-full transition-transform duration-500 group-hover:scale-105"><ProductImage src={p.primary_image_url} alt={p.title} /></div>
        <WishlistButton productId={p.id} className="absolute right-3 top-3" />
        {p.portability !== "fixed" && <Badge tone="clay" className="absolute left-3 top-3">{titleCase(p.portability)}</Badge>}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-sans text-base font-medium group-hover:text-clay">{p.title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{formatPrice(p.base_price)}</span>
          {p.review_count > 0 && <span className="flex items-center gap-1 text-muted"><Stars value={Number(p.avg_rating)} size={12} />({p.review_count})</span>}
        </div>
        <p className="text-xs text-muted">{titleCase(p.space_size)} footprint</p>
      </div>
    </Link>
  );
}

export function ProductGridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="space-y-3"><div className="aspect-[4/5] animate-pulse rounded-card bg-cream" /><div className="h-4 w-2/3 animate-pulse rounded bg-cream" /><div className="h-4 w-1/3 animate-pulse rounded bg-cream" /></div>
      ))}
    </div>
  );
}
