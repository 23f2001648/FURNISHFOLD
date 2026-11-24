import Link from "next/link";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils/cn";
export function EmptyState({ title, text, href, cta }: { title: string; text?: string; href?: string; cta?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-card border border-dashed border-line bg-white/50 px-6 py-14 text-center">
      <h3 className="text-xl">{title}</h3>
      {text && <p className="mt-2 text-sm text-muted">{text}</p>}
      {href && cta && <Link href={href} className={cn(buttonVariants(), "mt-6")}>{cta}</Link>}
    </div>
  );
}
