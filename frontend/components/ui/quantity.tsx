"use client";
import { Minus, Plus } from "lucide-react";
export function Quantity({ value, onChange, max = 20, disabled }: { value: number; onChange: (n: number) => void; max?: number; disabled?: boolean }) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-line bg-white">
      <button className="grid size-10 place-items-center disabled:opacity-40" disabled={disabled || value <= 1} onClick={() => onChange(value - 1)} aria-label="Decrease"><Minus size={14} /></button>
      <span className="w-6 text-center text-sm tabular-nums">{value}</span>
      <button className="grid size-10 place-items-center disabled:opacity-40" disabled={disabled || value >= max} onClick={() => onChange(value + 1)} aria-label="Increase"><Plus size={14} /></button>
    </div>
  );
}
