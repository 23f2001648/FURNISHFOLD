"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/use-auth";

const items = [["Overview", "/account"], ["Orders", "/account/orders"], ["Addresses", "/account/addresses"], ["Wishlist", "/account/wishlist"], ["Profile", "/account/profile"]];
export function AccountNav() {
  const path = usePathname();
  const { logout } = useAuth();
  return (
    <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
      {items.map(([l, h]) => (
        <Link key={h} href={h} className={cn("whitespace-nowrap rounded-full px-4 py-2 text-sm md:rounded-xl", path === h ? "bg-ink text-paper" : "hover:bg-cream")}>{l}</Link>
      ))}
      <button onClick={logout} className="whitespace-nowrap rounded-xl px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
    </nav>
  );
}
