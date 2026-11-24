import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
export const registerSchema = z.object({
  name: z.string().min(2, "At least 2 characters").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number").optional().or(z.literal("")),
  password: z.string().min(8, "At least 8 characters").max(128),
});
export const forgotSchema = z.object({ email: z.string().email("Enter a valid email") });
export const resetSchema = z.object({ password: z.string().min(8, "At least 8 characters"), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });
export const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  full_name: z.string().min(2, "Required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number"),
  line1: z.string().min(3, "Required"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Select a state"),
  postal_code: z.string().regex(/^\d{6}$/, "Enter a 6-digit PIN code"),
  country: z.string(),
  is_default: z.boolean(),
});
export const profileSchema = z.object({ name: z.string().min(2, "Required"), phone: z.string().optional().or(z.literal("")) });
export const reviewSchema = z.object({ rating: z.number().min(1, "Pick a rating").max(5), title: z.string().max(120).optional(), body: z.string().max(2000).optional() });
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
