import type { ProductFilters, Portability, SpaceSize } from "@/types/product";
/** URL search params <-> API filters. Keeps /shop shareable. */
export function filtersFromParams(sp: URLSearchParams, extra: Partial<ProductFilters> = {}): ProductFilters {
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : undefined);
  return {
    category: sp.get("category") ?? undefined,
    space_size: (sp.get("space") as SpaceSize) ?? undefined,
    portability: (sp.get("portability") as Portability) ?? undefined,
    min_price: num("min"), max_price: num("max"),
    search: sp.get("q") ?? undefined, page: num("page") ?? 1, ...extra,
  };
}
