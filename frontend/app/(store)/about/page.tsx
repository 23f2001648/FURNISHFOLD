import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Designed to fold, built to last." />
      <div className="container-ff max-w-2xl space-y-5 py-14 text-lg leading-relaxed text-ink/80">
        <p>FurnishFoldz makes foldable, space-saving furniture — study desks, laptop tables, computer tables and kids’ tables — for homes where every square foot matters.</p>
        <p>Our pieces are designed to open up when you need them and tuck away when you don’t, so one room can be a study, a studio and a living space in the same day.</p>
        <Link href="/shop" className={buttonVariants({ size: "lg", className: "mt-4" })}>Explore the collection</Link>
      </div>
    </>
  );
}
