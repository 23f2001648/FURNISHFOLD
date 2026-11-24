import { get, post, patch, del } from "./client";
import type { Paginated, Product, ProductFilters, ProductListItem, Category, Collection, Review } from "@/types/product";
import type { Cart } from "@/types/cart";
import type { Address, AddressInput, TokenResponse, User } from "@/types/user";
import type { Order, PaymentInitiate, Shipment } from "@/types/order";

const A = { auth: true } as const;

export const authApi = {
  login: (email: string, password: string) => post<TokenResponse>("/auth/login", { email, password }),
  register: (d: { name: string; email: string; phone?: string; password: string }) => post<TokenResponse>("/auth/register", d),
  // NOTE: these two are not in the backend yet (see README). Pages degrade gracefully on 404.
  forgotPassword: (email: string) => post<{ message: string }>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) => post<{ message: string }>("/auth/reset-password", { token, password }),
};
export const userApi = {
  me: () => get<User>("/users/me", A),
  update: (d: { name?: string; phone?: string }) => patch<User>("/users/me", d, A),
  addresses: () => get<Address[]>("/users/me/addresses", A),
  addAddress: (d: AddressInput) => post<Address>("/users/me/addresses", d, A),
  updateAddress: (id: string, d: Partial<AddressInput>) => patch<Address>(`/users/me/addresses/${id}`, d, A),
  deleteAddress: (id: string) => del<void>(`/users/me/addresses/${id}`, A),
};
export const catalogApi = {
  products: (q: ProductFilters = {}) => get<Paginated<ProductListItem>>("/products", { query: { page_size: 12, ...q } }),
  product: (slug: string) => get<Product>(`/products/${slug}`),
  categories: () => get<Category[]>("/categories"),
  category: (slug: string) => get<Category>(`/categories/${slug}`),
  collections: () => get<Collection[]>("/collections"),
  reviews: (productId: string) => get<Review[]>(`/reviews/product/${productId}`),
  addReview: (productId: string, d: { rating: number; title?: string; body?: string }) =>
    post<Review>(`/reviews/product/${productId}`, d, A),
};
export const cartApi = {
  get: () => get<Cart>("/cart", A),
  add: (variant_id: string, quantity = 1) => post<Cart>("/cart/items", { variant_id, quantity }, A),
  update: (id: string, quantity: number) => patch<Cart>(`/cart/items/${id}`, { quantity }, A),
  remove: (id: string) => del<Cart>(`/cart/items/${id}`, A),
  coupon: (code: string) => post<Cart>("/cart/coupon", { code }, A),
};
export const wishlistApi = {
  list: () => get<{ id: string; product_id: string }[]>("/wishlist", A),
  add: (productId: string) => post(`/wishlist/${productId}`, undefined, A),
  remove: (productId: string) => del<void>(`/wishlist/${productId}`, A),
};
export const orderApi = {
  list: () => get<Order[]>("/orders", A),
  get: (id: string) => get<Order>(`/orders/${id}`, A),
  place: (d: { shipping_address_id: string; billing_address_id?: string; coupon_code?: string | null; customer_note?: string; payment_provider: string }) =>
    post<Order>("/orders", d, A),
  cancel: (id: string) => post<Order>(`/orders/${id}/cancel`, undefined, A),
  shipments: (id: string) => get<Shipment[]>(`/shipments/order/${id}`, A),
};
export const paymentApi = {
  initiate: (orderId: string, provider: string) => post<PaymentInitiate>(`/payments/${orderId}/initiate`, undefined, { ...A, query: { provider } }),
  verify: (d: { payment_id: string; provider_payment_id: string; provider_signature: string }) => post("/payments/verify", d, A),
};
