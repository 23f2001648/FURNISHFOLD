"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, userApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import type { LoginInput, RegisterInput } from "@/lib/validations";

export function useAuth() {
  const { accessToken, hydrated, setTokens, clear } = useAuthStore();
  const qc = useQueryClient();
  const router = useRouter();

  const me = useQuery({ queryKey: ["me"], queryFn: userApi.me, enabled: hydrated && !!accessToken, retry: false });

  const login = useMutation({
    mutationFn: (d: LoginInput) => authApi.login(d.email, d.password),
    onSuccess: (t) => { setTokens(t.access_token, t.refresh_token); qc.invalidateQueries(); },
  });
  const register = useMutation({
    mutationFn: (d: RegisterInput) => authApi.register({ name: d.name, email: d.email, password: d.password, phone: d.phone || undefined }),
    onSuccess: (t) => { setTokens(t.access_token, t.refresh_token); qc.invalidateQueries(); },
  });
  const logout = () => { clear(); qc.clear(); router.push("/"); };

  return {
    user: me.data, isAuthed: !!accessToken, ready: hydrated,
    isLoading: !hydrated || (!!accessToken && me.isLoading),
    login, register, logout,
  };
}
