import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/constants/blog";

type P = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return { title: p?.title ?? "Journal", description: p?.excerpt };
}
export default async function PostPage({ params }: P) {
  const { slug } = await params;
  const post = POSTS.find((x) => x.slug === slug);
  if (!post) notFound();
  return (
    <article className="container-ff max-w-2xl py-14">
      <Link href="/blog" className="text-sm text-muted hover:text-ink">← Journal</Link>
      <h1 className="mt-4 text-5xl">{post.title}</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">{post.body.map((t, i) => <p key={i}>{t}</p>)}</div>
    </article>
  );
}
