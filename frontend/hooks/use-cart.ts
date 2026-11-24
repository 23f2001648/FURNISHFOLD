"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import type { Cart } from "@/types/cart";

export function useCart() {
  const { accessToken, hydrated } = useAuthStore();
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const cart = useQuery({ queryKey: ["cart"], queryFn: cartApi.get, enabled: hydrated && !!accessToken });
  const set = (c: Cart) => qc.setQueryData(["cart"], c);
  const onError = (e: Error) => toast.error(e.message);

  const add = useMutation({
    mutationFn: ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => cartApi.add(variantId, quantity),
    onSuccess: (c) => { set(c); toast.success("Added to your cart"); }, onError,
  });
  const update = useMutation({ mutationFn: ({ id, quantity }: { id: string; quantity: number }) => cartApi.update(id, quantity), onSuccess: set, onError });
  const remove = useMutation({ mutationFn: (id: string) => cartApi.remove(id), onSuccess: set, onError });
  const coupon = useMutation({ mutationFn: (code: string) => cartApi.coupon(code), onSuccess: (c) => { set(c); toast.success("Coupon applied"); }, onError });

  /** The backend cart is per-account, so guests are sent to log in first. */
  const addToCart = (variantId: string, quantity = 1) => {
    if (!accessToken) {
      toast("Sign in to add items to your cart");
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    add.mutate({ variantId, quantity });
  };

  const count = cart.data?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;
  return { cart: cart.data, isLoading: cart.isLoading, count, add, addToCart, update, remove, coupon };
}
