"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/ui/error-box";
import { Field, Input } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginInput } from "@/lib/validations";

export const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  return (
    <form onSubmit={handleSubmit((d) => login.mutate(d, { onSuccess: () => { toast.success("Welcome back!"); router.replace(next); } }))} className="space-y-5">
      <div><h1 className="text-3xl">Welcome back</h1><p className="mt-1 text-sm text-muted">Sign in to your account.</p></div>
      {login.error && <ErrorBox message={login.error.message} />}
      <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></Field>
      <Field label="Password" error={errors.password?.message}><Input type="password" autoComplete="current-password" {...register("password")} /></Field>
      <div className="text-right text-sm"><Link href="/forgot-password" className="text-clay hover:underline">Forgot password?</Link></div>
      <Button className="w-full" size="lg" loading={login.isPending}>Sign in</Button>
      <p className="text-center text-sm text-muted">New here? <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-clay hover:underline">Create an account</Link></p>
    </form>
  );
}
