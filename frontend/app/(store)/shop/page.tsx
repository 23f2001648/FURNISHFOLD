import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Shop all furniture" };

export default function ShopPage() {
  return (
    <>
      <PageHeader eyebrow="The collection" title="Shop all furniture" text="Filter by how much room you have and how you like to move things around." />
      <Suspense><CatalogBrowser /></Suspense>
    </>
  );
}
