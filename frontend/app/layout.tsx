import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/layout/providers";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "Foldable, space-saving study desks, laptop tables and kids’ tables.",
};
export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
