import type { ProductVariant } from "./product";
export interface CartItem { id: string; variant: ProductVariant; quantity: number; line_total: string }
export interface Cart { id: string; items: CartItem[]; subtotal: string; discount_amount: string; total: string; coupon_code: string | null }
