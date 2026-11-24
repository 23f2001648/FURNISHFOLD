import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/lib/auth/store";
import type { TokenResponse } from "@/types/user";

/** Matches the backend's { error: { code, message, details } } envelope. */
export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

type Opts = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
};

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const { refreshToken, setTokens, clear } = useAuthStore.getState();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) throw new Error("refresh failed");
    const t = (await res.json()) as TokenResponse;
    setTokens(t.access_token, t.refresh_token);
    return true;
  } catch {
    clear();
    return false;
  }
}

export async function api<T = unknown>(path: string, opts: Opts = {}, retried = false): Promise<T> {
  const { body, query, auth = false, headers, ...rest } = opts;
  const qs = query
    ? "?" + Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")
    : "";
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${API_URL}${path}${qs === "?" ? "" : qs}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !retried) {
    refreshing ??= refreshTokens().finally(() => (refreshing = null));
    if (await refreshing) return api<T>(path, opts, true);
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = data?.error;
    const fieldErrors = e?.details?.errors as { loc?: string[]; msg: string }[] | undefined;
    const msg = fieldErrors?.length
      ? fieldErrors.map((x) => `${x.loc?.slice(-1)[0] ?? "field"}: ${x.msg}`).join(", ")
      : e?.message ?? data?.detail ?? "Something went wrong. Please try again.";
    throw new ApiError(res.status, e?.code ?? "error", msg, e?.details);
  }
  return data as T;
}

export const get = <T,>(p: string, o?: Opts) => api<T>(p, { ...o, method: "GET" });
export const post = <T,>(p: string, body?: unknown, o?: Opts) => api<T>(p, { ...o, method: "POST", body });
export const patch = <T,>(p: string, body?: unknown, o?: Opts) => api<T>(p, { ...o, method: "PATCH", body });
export const del = <T,>(p: string, o?: Opts) => api<T>(p, { ...o, method: "DELETE" });
