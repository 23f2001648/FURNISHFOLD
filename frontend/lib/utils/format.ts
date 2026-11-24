import { ASSET_URL } from "@/lib/constants";
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = (v: string | number | null | undefined) => (v == null ? "" : inr.format(Number(v)));
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const discountPct = (price: string, compareAt: string | null) =>
  compareAt && Number(compareAt) > Number(price) ? Math.round((1 - Number(price) / Number(compareAt)) * 100) : 0;
/** Backend returns "/static/..." for locally stored uploads; make it absolute. */
export const assetUrl = (url: string | null | undefined) =>
  !url ? null : /^https?:\/\//.test(url) ? url : `${ASSET_URL}${url}`;
export const titleCase = (s: string) => s.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
