import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Gallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/rating";
import { getProduct } from "@/lib/api/server";
import { assetUrl, titleCase } from "@/lib/utils/format";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Product not found" };
  const img = assetUrl(p.images[0]?.url);
  return { title: p.title, description: p.description?.slice(0, 160), openGraph: { images: img ? [img] : [] } };
}

export default async function ProductPage({ params }: P) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description,
    image: p.images.map((i) => assetUrl(i.url)),
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.base_price },
    ...(p.review_count > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: p.avg_rating, reviewCount: p.review_count } }),
  };
  return (
    <div className="container-ff py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-muted"><Link href="/" className="hover:text-ink">Home</Link> / <Link href="/shop" className="hover:text-ink">Shop</Link> / <span className="text-ink">{p.title}</span></nav>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={p.images} title={p.title} />
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex gap-2"><Badge>{titleCase(p.portability)}</Badge><Badge>{titleCase(p.space_size)} footprint</Badge></div>
            <h1 className="text-4xl">{p.title}</h1>
            {p.review_count > 0 && <a href="#reviews" className="mt-2 flex items-center gap-2 text-sm text-muted"><Stars value={Number(p.avg_rating)} />{Number(p.avg_rating).toFixed(1)} · {p.review_count} reviews</a>}
          </div>
          <PurchasePanel product={p} />
          {p.description && <p className="leading-relaxed text-muted">{p.description}</p>}
          {p.features && p.features.length > 0 && (
            <ul className="space-y-2">{p.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check size={16} className="text-sage" />{f}</li>)}</ul>
          )}
        </div>
      </div>
      <div className="mt-20 border-t border-line pt-14"><ReviewsSection productId={p.id} avg={Number(p.avg_rating)} count={p.review_count} /></div>
    </div>
  );
}
