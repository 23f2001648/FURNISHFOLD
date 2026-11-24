"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { userApi } from "@/lib/api/endpoints";
import { profileSchema } from "@/lib/validations";

type F = { name: string; phone?: string };

function Form({ name, phone, email }: { name: string; phone: string; email: string }) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(profileSchema), defaultValues: { name, phone } });
  const m = useMutation({
    mutationFn: (d: F) => userApi.update({ name: d.name, phone: d.phone || undefined }),
    onSuccess: () => { toast.success("Profile updated"); qc.invalidateQueries({ queryKey: ["me"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={handleSubmit((d) => m.mutate(d))} className="max-w-md space-y-5">
      <Field label="Email"><Input value={email} disabled readOnly /></Field>
      <Field label="Full name" error={errors.name?.message}><Input {...register("name")} /></Field>
      <Field label="Mobile"><Input {...register("phone")} inputMode="tel" /></Field>
      <Button loading={m.isPending}>Save changes</Button>
    </form>
  );
}
export default function ProfilePage() {
  const { user } = useAuth();
  return <div className="space-y-6"><h1 className="text-4xl">Profile</h1>{user ? <Form name={user.name} phone={user.phone ?? ""} email={user.email} /> : <Skeleton className="h-64 max-w-md" />}</div>;
}
