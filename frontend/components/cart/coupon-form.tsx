"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useCart } from "@/hooks/use-cart";

export function CouponForm() {
  const [code, setCode] = useState("");
  const { coupon, cart } = useCart();
  return (
    <form className="flex gap-2 pt-2" onSubmit={(e) => { e.preventDefault(); if (code.trim()) coupon.mutate(code.trim().toUpperCase(), { onSuccess: () => setCode("") }); }}>
      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={cart?.coupon_code ? `Applied: ${cart.coupon_code}` : "Coupon code"} className="uppercase" />
      <Button variant="outline" loading={coupon.isPending}>Apply</Button>
    </form>
  );
}
