import Link from "next/link";
import { Logo } from "@/components/navbar/navbar";
import { SITE } from "@/lib/constants";

const cols = [
  { title: "Shop", links: [["All furniture", "/shop"], ["Foldable desks", "/shop?portability=foldable"], ["Compact spaces", "/shop?space=compact"], ["Kids tables", "/category/kids-table"]] },
  { title: "Account", links: [["Sign in", "/login"], ["My orders", "/account/orders"], ["Addresses", "/account/addresses"], ["Wishlist", "/account/wishlist"]] },
  { title: "Company", links: [["About", "/about"], ["Journal", "/blog"], ["Contact", "/contact"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream/70">
      <div className="container-ff grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3"><Logo /><p className="max-w-xs text-sm text-muted">{SITE.tagline}. Thoughtfully designed tables and desks for small rooms and big ideas.</p></div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 font-sans text-sm font-semibold">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted">{c.links.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-ink">{l}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
    </footer>
  );
}
