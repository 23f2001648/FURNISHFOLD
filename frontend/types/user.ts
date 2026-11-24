export interface User { id: string; name: string; email: string; phone: string | null; role: "customer" | "admin"; is_active: boolean; created_at: string }
export interface TokenResponse { access_token: string; refresh_token: string; token_type: string }
export interface Address {
  id: string; type: "shipping" | "billing"; full_name: string; phone: string; line1: string;
  line2: string | null; city: string; state: string; postal_code: string; country: string; is_default: boolean;
}
export type AddressInput = Omit<Address, "id">;
