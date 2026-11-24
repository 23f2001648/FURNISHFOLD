import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
export const pageMeta = (title: string, description?: string): Metadata => ({
  title, description: description ?? `${SITE.name} — ${SITE.tagline}`,
  openGraph: { title: `${title} | ${SITE.name}`, description },
});
