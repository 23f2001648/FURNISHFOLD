"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

/** Client-side route protection (tokens live in localStorage, so middleware can't see them). */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, isAuthed } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (ready && !isAuthed) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, isAuthed, router, pathname]);
  if (!ready || !isAuthed) return <div className="grid min-h-[40vh] place-items-center"><Spinner /></div>;
  return <>{children}</>;
}
