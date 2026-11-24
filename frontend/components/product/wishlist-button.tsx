"use client";
import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/use-wishlist";
import { cn } from "@/lib/utils/cn";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(productId);
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(productId); }}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={on}
      className={cn("grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110", className)}
    >
      <Heart size={17} className={cn(on ? "fill-clay text-clay" : "text-ink")} />
    </button>
  );
}
