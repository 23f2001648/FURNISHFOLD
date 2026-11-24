"use client";
import { useCategories } from "@/hooks/use-products";
import { PORTABILITY, SPACE_SIZES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useState } from "react";

type Props = { params: URLSearchParams; onChange: (patch: Record<string, string | null>) => void; hideCategory?: boolean };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="border-b border-line pb-5"><h4 className="mb-3 font-sans text-sm font-semibold">{title}</h4><div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">{children}</div></div>;
}
const chip = (on: boolean) => cn("rounded-full border px-3.5 py-1.5 text-left text-sm transition-colors", on ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink");

export function Filters({ params, onChange, hideCategory }: Props) {
  const { data: cats } = useCategories();
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");
  const pick = (key: string, v: string) => onChange({ [key]: params.get(key) === v ? null : v });

  return (
    <aside className="space-y-5">
      {!hideCategory && (
        <Group title="Category">
          {cats?.map((c) => <button key={c.id} className={chip(params.get("category") === c.slug)} onClick={() => pick("category", c.slug)}>{c.name}</button>)}
        </Group>
      )}
      <Group title="Space needed">
        {SPACE_SIZES.map((s) => <button key={s.value} className={chip(params.get("space") === s.value)} onClick={() => pick("space", s.value)}>{s.label}<span className="ml-2 hidden text-xs opacity-60 xl:inline">{s.hint}</span></button>)}
      </Group>
      <Group title="Portability">
        {PORTABILITY.map((s) => <button key={s.value} className={chip(params.get("portability") === s.value)} onClick={() => pick("portability", s.value)}>{s.label}</button>)}
      </Group>
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold">Price (₹)</h4>
        <div className="flex items-center gap-2">
          <Input type="number" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
          <span className="text-muted">–</span>
          <Input type="number" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onChange({ min: min || null, max: max || null })}>Apply price</Button>
      </div>
    </aside>
  );
}
