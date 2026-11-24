"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { INDIAN_STATES } from "@/lib/constants";
import { addressSchema, type AddressForm as F } from "@/lib/validations";
import type { Address } from "@/types/user";

export function AddressForm({ initial, onSubmit, loading, onCancel }: { initial?: Address; onSubmit: (d: F) => void; loading?: boolean; onCancel?: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ? { ...initial, line2: initial.line2 ?? "" } : { type: "shipping", country: "India", is_default: false, state: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.full_name?.message}><Input {...register("full_name")} autoComplete="name" /></Field>
      <Field label="Mobile number" error={errors.phone?.message}><Input {...register("phone")} inputMode="tel" autoComplete="tel-national" maxLength={10} /></Field>
      <Field label="Address line 1" error={errors.line1?.message} className="sm:col-span-2"><Input {...register("line1")} autoComplete="address-line1" /></Field>
      <Field label="Address line 2 (optional)" className="sm:col-span-2"><Input {...register("line2")} autoComplete="address-line2" /></Field>
      <Field label="City" error={errors.city?.message}><Input {...register("city")} autoComplete="address-level2" /></Field>
      <Field label="State" error={errors.state?.message}>
        <Select {...register("state")}><option value="">Select state</option>{INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}</Select>
      </Field>
      <Field label="PIN code" error={errors.postal_code?.message}><Input {...register("postal_code")} inputMode="numeric" maxLength={6} autoComplete="postal-code" /></Field>
      <input type="hidden" {...register("country")} /><input type="hidden" {...register("type")} />
      <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" {...register("is_default")} className="size-4 accent-clay" />Make this my default address</label>
      <div className="flex gap-3 sm:col-span-2">
        <Button loading={loading}>{initial ? "Save changes" : "Save address"}</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
