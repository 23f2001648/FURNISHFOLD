import { Maximize2, Move, Hammer } from "lucide-react";
const items = [
  [Maximize2, "Made for small rooms", "Compact footprints that still feel generous."],
  [Move, "Folds and rolls away", "Foldable and wheeled designs you can reconfigure in seconds."],
  [Hammer, "Easy to live with", "Designs that set up quickly so you can start using them right away."],
] as const;
export function ValueProps() {
  return (
    <section className="container-ff grid gap-8 py-16 md:grid-cols-3">
      {items.map(([Icon, t, d]) => (
        <div key={t} className="flex gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-full bg-cream"><Icon className="text-clay" size={22} /></div><div><h3 className="font-sans text-base font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div></div>
      ))}
    </section>
  );
}
