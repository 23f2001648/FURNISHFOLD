"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/ui/error-box";
import { Field, Input } from "@/components/ui/form";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints";
import { resetSchema } from "@/lib/validations";

export function ResetForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<{ password: string; confirm: string }>({ resolver: zodResolver(resetSchema) });
  const m = useMutation({
    mutationFn: (d: { password: string }) => authApi.resetPassword(token!, d.password),
    onSuccess: () => { toast.success("Password updated. Please sign in."); router.replace("/login"); },
  });
  if (!token) return <div className="space-y-3 text-center"><h1 className="text-3xl">Link expired</h1><p className="text-sm text-muted">This reset link is missing or invalid.</p><Link href="/forgot-password" className="text-sm text-clay hover:underline">Request a new link</Link></div>;
  const unsupported = m.error instanceof ApiError && (m.error.status === 404 || m.error.status === 405);
  return (
    <form onSubmit={handleSubmit((d) => m.mutate(d))} className="space-y-5">
      <div><h1 className="text-3xl">Choose a new password</h1></div>
      {m.error && <ErrorBox message={unsupported ? "Password reset isn’t enabled on the server yet." : m.error.message} />}
      <Field label="New password" error={errors.password?.message}><Input type="password" autoComplete="new-password" {...register("password")} /></Field>
      <Field label="Confirm password" error={errors.confirm?.message}><Input type="password" autoComplete="new-password" {...register("confirm")} /></Field>
      <Button className="w-full" size="lg" loading={m.isPending}>Update password</Button>
    </form>
  );
}
