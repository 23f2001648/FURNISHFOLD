export type SpaceSize = "compact" | "standard" | "spacious";
export type Portability = "foldable" | "wheeled" | "fixed";

export interface ProductImage { id: string; url: string; alt_text: string; sort_order: number; is_primary: boolean }
export interface ProductVariant {
  id: string; product_id: string; sku: string; color: string | null; size: string | null;
  price: string; compare_at_price: string | null; weight_kg: string | null;
  is_active: boolean; quantity_available: number;
}
export interface ProductListItem {
  id: string; title: string; slug: string; base_price: string; space_size: SpaceSize;
  portability: Portability; avg_rating: string; review_count: number; primary_image_url: string | null;
}
export interface Product {
  id: string; title: string; slug: string; description: string | null; base_price: string;
  category_id: string; space_size: SpaceSize; portability: Portability; features: string[] | null;
  model_3d_url: string | null; is_active: boolean; avg_rating: string; review_count: number;
  created_at: string; images: ProductImage[]; variants: ProductVariant[];
}
export interface Category { id: string; name: string; slug: string; description: string | null; parent_id: string | null }
export interface Collection { id: string; name: string; slug: string; description: string | null }
export interface Review {
  id: string; user_id: string; product_id: string; rating: number; title: string | null;
  body: string | null; is_verified_purchase: boolean; created_at: string;
}
export interface Paginated<T> { items: T[]; total: number; page: number; page_size: number; total_pages: number }
export interface ProductFilters {
  category?: string; space_size?: SpaceSize; portability?: Portability;
  min_price?: number; max_price?: number; search?: string; page?: number; page_size?: number;
}
