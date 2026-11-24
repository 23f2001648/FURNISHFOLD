"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api/endpoints";
import type { ProductFilters } from "@/types/product";

export const useProducts = (f: ProductFilters) =>
  useQuery({ queryKey: ["products", f], queryFn: () => catalogApi.products(f), placeholderData: keepPreviousData });
export const useCategories = () => useQuery({ queryKey: ["categories"], queryFn: catalogApi.categories, staleTime: 300_000 });
export const useReviews = (productId: string) => useQuery({ queryKey: ["reviews", productId], queryFn: () => catalogApi.reviews(productId) });
