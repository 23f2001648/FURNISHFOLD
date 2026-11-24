import { API_URL } from "@/lib/constants";
import type { Product, Category } from "@/types/product";

async function sget<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null; // backend offline during build/dev: pages render their not-found/empty state
  }
}
export const getProduct = (slug: string) => sget<Product>(`/products/${slug}`);
export const getCategory = (slug: string) => sget<Category>(`/categories/${slug}`);
