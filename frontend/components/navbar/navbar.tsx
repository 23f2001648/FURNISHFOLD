"use client";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchBox } from "@/components/search/search-box";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-7 text-clay" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h24M7 12l-2 14M25 12l2 14M11 12l5 14M21 12l-5 14" /></svg>
      {SITE.name}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const { count } = useCart();
  const { isAuthed, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="bg-ink py-1.5 text-center text-xs text-paper/90">Space-saving furniture for modern Indian homes</div>
      <div className="container-ff flex h-16 items-center gap-6">
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        <Logo />
        <nav className="ml-6 hidden gap-7 text-sm md:flex">
          {NAV_LINKS.map((l) => <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">{l.label}</Link>)}
        </nav>
        <div className="ml-auto hidden w-64 lg:block"><SearchBox /></div>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button className="grid size-10 place-items-center rounded-full hover:bg-cream lg:hidden" onClick={() => setSearching(!searching)} aria-label="Search"><Search size={20} /></button>
          <Link href="/account/wishlist" className="hidden size-10 place-items-center rounded-full hover:bg-cream sm:grid" aria-label="Wishlist"><Heart size={20} /></Link>
          <Link href={isAuthed ? "/account" : "/login"} className="flex h-10 items-center gap-2 rounded-full px-2.5 hover:bg-cream" aria-label="Account">
            <User size={20} /><span className="hidden text-sm lg:inline">{isAuthed ? user?.name.split(" ")[0] ?? "Account" : "Sign in"}</span>
          </Link>
          <Link href="/cart" className="relative grid size-10 place-items-center rounded-full hover:bg-cream" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute right-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-clay text-[10px] font-semibold text-white">{count}</span>}
          </Link>
        </div>
      </div>
      {searching && <div className="container-ff pb-3 lg:hidden"><SearchBox autoFocus onDone={() => setSearching(false)} /></div>}
      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="container-ff flex flex-col py-2">
            {NAV_LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line/60 py-3 text-base last:border-0">{l.label}</Link>)}
            <Link href="/account/wishlist" onClick={() => setOpen(false)} className="py-3">Wishlist</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
