import { assetUrl } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** Shows the uploaded photo, or a line-drawing of a folding desk when the catalogue has no image yet. */
export function ProductImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const url = assetUrl(src);
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} loading="lazy" className={cn("size-full object-cover", className)} />;
  }
  return (
    <div role="img" aria-label={alt} className={cn("grid size-full place-items-center bg-gradient-to-br from-cream to-oak/30", className)}>
      <svg viewBox="0 0 120 90" className="w-1/2 text-clay/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 34h92M20 34l-4 40M100 34l4 40M30 34l16 40M90 34l-16 40" /><path d="M46 74h28" opacity=".5" />
      </svg>
    </div>
  );
}
