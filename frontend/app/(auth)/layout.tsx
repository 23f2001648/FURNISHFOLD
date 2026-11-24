import Link from "next/link";
import { Logo } from "@/components/navbar/navbar";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream/60 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-card border border-line bg-paper p-7 shadow-sm sm:p-9">{children}</div>
        <p className="mt-6 text-center text-sm text-muted"><Link href="/" className="hover:text-ink">← Back to the store</Link></p>
      </div>
    </div>
  );
}
