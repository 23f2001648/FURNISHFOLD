import type { Address } from "./user";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "razorpay" | "cashfree" | "cod";
export interface OrderItem { id: string; product_title_snapshot: string; variant_label_snapshot: string; unit_price: string; quantity: number; line_total: string }
export interface Order {
  id: string; order_number: string; status: OrderStatus; payment_status: PaymentStatus; shipping_status: string;
  subtotal: string; discount_amount: string; shipping_amount: string; tax_amount: string; total_amount: string;
  items: OrderItem[]; shipping_address: Address; created_at: string;
}
export interface PaymentInitiate { payment_id: string; provider: PaymentProvider; provider_order_id: string | null; amount: string; currency: string; key_id: string | null }
export interface Shipment { id: string; carrier: string; tracking_number: string | null; tracking_url: string | null; status: string; estimated_delivery: string | null }
