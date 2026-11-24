export const SITE = {
  name: "FurnishFoldz",
  tagline: "Furniture that folds into your life",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@furnishfoldz.in",
};
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
export const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL ?? "http://localhost:8000";

export const SPACE_SIZES = [
  { value: "compact", label: "Compact", hint: "Studio & dorm friendly" },
  { value: "standard", label: "Standard", hint: "Fits most rooms" },
  { value: "spacious", label: "Spacious", hint: "Full home office" },
] as const;
export const PORTABILITY = [
  { value: "foldable", label: "Foldable" },
  { value: "wheeled", label: "On wheels" },
  { value: "fixed", label: "Fixed" },
] as const;
export const PAYMENT_METHODS = [
  { value: "razorpay", label: "Pay online (Razorpay)", hint: "UPI, cards, netbanking, wallets" },
  { value: "cashfree", label: "Pay online (Cashfree)", hint: "UPI, cards, netbanking" },
  { value: "cod", label: "Cash on delivery", hint: "Pay when it arrives" },
] as const;
export const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Jammu and Kashmir","Chandigarh","Puducherry"];
export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
