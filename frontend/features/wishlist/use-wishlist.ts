"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { wishlistApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";

export function useWishlist() {
  const { accessToken, hydrated } = useAuthStore();
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const q = useQuery({ queryKey: ["wishlist"], queryFn: wishlistApi.list, enabled: hydrated && !!accessToken });
  const ids = new Set(q.data?.map((i) => i.product_id));

  const toggleMut = useMutation({
    mutationFn: (p: { id: string; on: boolean }) => (p.on ? wishlistApi.remove(p.id) : wishlistApi.add(p.id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = (productId: string) => {
    if (!accessToken) { router.push(`/login?next=${encodeURIComponent(pathname)}`); return; }
    toggleMut.mutate({ id: productId, on: ids.has(productId) });
  };
  return { ids, has: (id: string) => ids.has(id), toggle, items: q.data ?? [], isLoading: q.isLoading };
}
