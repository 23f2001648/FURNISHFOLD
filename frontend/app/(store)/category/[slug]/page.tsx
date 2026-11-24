import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { PageHeader } from "@/components/ui/page-header";
import { getCategory } from "@/lib/api/server";

type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return { title: c?.name ?? "Category", description: c?.description ?? undefined };
}
export default async function CategoryPage({ params }: P) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) notFound();
  return (
    <>
      <PageHeader eyebrow="Category" title={c.name} text={c.description ?? undefined} />
      <Suspense><CatalogBrowser fixedCategory={slug} /></Suspense>
    </>
  );
}
