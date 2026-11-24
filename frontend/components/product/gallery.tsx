"use client";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProductImage as Img } from "@/types/product";
import { ProductImage } from "./product-image";

export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const sorted = [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
  const [i, setI] = useState(0);
  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-card bg-cream"><ProductImage src={sorted[i]?.url} alt={sorted[i]?.alt_text || title} /></div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((im, idx) => (
            <button key={im.id} onClick={() => setI(idx)} className={cn("size-20 shrink-0 overflow-hidden rounded-xl border-2", idx === i ? "border-ink" : "border-transparent")}>
              <ProductImage src={im.url} alt={im.alt_text || title} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
