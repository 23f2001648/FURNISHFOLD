import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { POSTS } from "@/lib/constants/blog";

export const metadata: Metadata = { title: "Journal" };
export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Journal" title="Ideas for small spaces" text="Guides and inspiration for living well with less floor." />
      <div className="container-ff grid gap-6 py-12 md:grid-cols-3">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-card border border-line bg-white p-6 transition hover:border-ink">
            <h2 className="text-2xl group-hover:text-clay">{p.title}</h2><p className="mt-3 text-sm text-muted">{p.excerpt}</p><p className="mt-5 text-sm text-clay">Read more →</p>
          </Link>
        ))}
      </div>
    </>
  );
}
