"use client";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { catalogApi } from "@/lib/api/endpoints";

// The backend only exposes GET /collections (featured list) — there's no per-collection product endpoint yet,
// so this page shows the collection's details above the full catalogue.
export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useQuery({ queryKey: ["collections"], queryFn: catalogApi.collections });
  if (isLoading) return <div className="grid min-h-[40vh] place-items-center"><Spinner /></div>;
  const c = data?.find((x) => x.slug === slug);
  if (!c) return <div className="container-ff py-20"><EmptyState title="Collection not found" href="/shop" cta="Browse the shop" /></div>;
  return (
    <>
      <PageHeader eyebrow="Collection" title={c.name} text={c.description ?? undefined} />
      <div className="container-ff py-10"><ProductGrid filters={{ page: 1, page_size: 12 }} hidePager /></div>
    </>
  );
}
