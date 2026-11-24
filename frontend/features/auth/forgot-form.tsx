"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/ui/error-box";
import { Field, Input } from "@/components/ui/form";
import { authApi } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import { forgotSchema } from "@/lib/validations";

export function ForgotForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({ resolver: zodResolver(forgotSchema) });
  const m = useMutation({ mutationFn: (d: { email: string }) => authApi.forgotPassword(d.email) });
  const unsupported = m.error instanceof ApiError && (m.error.status === 404 || m.error.status === 405);
  if (m.isSuccess) return <div className="space-y-4 text-center"><h1 className="text-3xl">Check your inbox</h1><p className="text-sm text-muted">If an account exists for that email, a reset link is on its way.</p><Link href="/login" className="text-sm text-clay hover:underline">Back to sign in</Link></div>;
  return (
    <form onSubmit={handleSubmit((d) => m.mutate(d))} className="space-y-5">
      <div><h1 className="text-3xl">Reset password</h1><p className="mt-1 text-sm text-muted">We’ll email you a link to choose a new one.</p></div>
      {m.error && <ErrorBox message={unsupported ? "Password reset isn’t enabled on the server yet. Please contact support." : m.error.message} />}
      <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></Field>
      <Button className="w-full" size="lg" loading={m.isPending}>Send reset link</Button>
      <p className="text-center text-sm"><Link href="/login" className="text-clay hover:underline">Back to sign in</Link></p>
    </form>
  );
}
