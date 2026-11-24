"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function SearchBox({ className, autoFocus, onDone }: { className?: string; autoFocus?: boolean; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form role="search" className={cn("relative", className)} onSubmit={(e) => { e.preventDefault(); if (q.trim()) { router.push(`/shop?q=${encodeURIComponent(q.trim())}`); onDone?.(); } }}>
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search desks, tables…" aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm focus:border-ink focus:outline-none" />
    </form>
  );
}
