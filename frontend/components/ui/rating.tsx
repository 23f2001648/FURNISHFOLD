"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={cn(i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-line fill-line")} />
      ))}
    </span>
  );
}
export function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button type="button" key={i} onClick={() => onChange(i)} aria-label={`${i} stars`}>
          <Star size={26} className={cn(i <= value ? "fill-amber-400 text-amber-400" : "text-line")} />
        </button>
      ))}
    </div>
  );
}
