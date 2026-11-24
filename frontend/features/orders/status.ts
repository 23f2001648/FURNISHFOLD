import type { OrderStatus } from "@/types/order";
export const ORDER_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
export const statusTone = (s: string) =>
  s === "delivered" || s === "paid" ? "success" : s === "cancelled" || s === "failed" || s === "refunded" ? "danger" : s === "pending" ? "warn" : "info";
export const canCancel = (s: OrderStatus) => s === "pending" || s === "confirmed";
