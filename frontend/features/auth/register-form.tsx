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
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { safeNext } from "./login-form";

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  return (
    <form onSubmit={handleSubmit((d) => signUp.mutate(d, { onSuccess: () => { toast.success("Account created"); router.replace(next); } }))} className="space-y-5">
      <div><h1 className="text-3xl">Create your account</h1><p className="mt-1 text-sm text-muted">Track orders and check out faster.</p></div>
      {signUp.error && <ErrorBox message={signUp.error.message} />}
      <Field label="Full name" error={errors.name?.message}><Input autoComplete="name" {...register("name")} /></Field>
      <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></Field>
      <Field label="Mobile (optional)" error={errors.phone?.message}><Input inputMode="tel" maxLength={10} autoComplete="tel-national" {...register("phone")} /></Field>
      <Field label="Password" error={errors.password?.message}><Input type="password" autoComplete="new-password" {...register("password")} /></Field>
      <Button className="w-full" size="lg" loading={signUp.isPending}>Create account</Button>
      <p className="text-center text-sm text-muted">Already registered? <Link href="/login" className="text-clay hover:underline">Sign in</Link></p>
    </form>
  );
}
