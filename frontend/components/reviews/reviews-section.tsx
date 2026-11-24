"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Stars, StarInput } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useReviews } from "@/hooks/use-products";
import { catalogApi } from "@/lib/api/endpoints";
import { formatDate } from "@/lib/utils/format";
import { reviewSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = reviewSchema.omit({ rating: true });
type F = z.infer<typeof formSchema>;

function ReviewForm({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, reset, formState: {} } = useForm<F>({ resolver: zodResolver(formSchema) });
  const m = useMutation({
    mutationFn: (d: F) => catalogApi.addReview(productId, { rating, title: d.title || undefined, body: d.body || undefined }),
    onSuccess: () => { toast.success("Thanks for your review!"); reset(); setRating(0); qc.invalidateQueries({ queryKey: ["reviews", productId] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={handleSubmit((d) => { if (rating === 0) return toast.error("Please pick a star rating"); m.mutate(d); })} className="space-y-4 rounded-card border border-line bg-white p-5">
      <h4 className="font-sans font-semibold">Write a review</h4>
      <StarInput value={rating} onChange={setRating} />
      <Field label="Title"><Input {...register("title")} placeholder="Sums it up" /></Field>
      <Field label="Your review"><Textarea {...register("body")} placeholder="How does it fit in your space?" /></Field>
      <Button loading={m.isPending}>Submit review</Button>
    </form>
  );
}

export function ReviewsSection({ productId, avg, count }: { productId: string; avg: number; count: number }) {
  const { data, isLoading } = useReviews(productId);
  const { isAuthed } = useAuth();
  return (
    <section id="reviews" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-5">
        <h2 className="text-3xl">Reviews</h2>
        {count > 0 && <div className="flex items-center gap-3"><span className="text-4xl font-semibold">{avg.toFixed(1)}</span><div><Stars value={avg} size={18} /><p className="text-sm text-muted">{count} review{count === 1 ? "" : "s"}</p></div></div>}
        {isAuthed ? <ReviewForm productId={productId} /> : <p className="text-sm text-muted"><Link href="/login" className="text-clay underline">Sign in</Link> to share your experience.</p>}
      </div>
      <div className="space-y-5">
        {isLoading && <Skeleton className="h-28" />}
        {data?.length === 0 && <EmptyState title="No reviews yet" text="Be the first to review this piece." />}
        {data?.map((r) => (
          <article key={r.id} className="border-b border-line pb-5">
            <div className="flex items-center justify-between"><Stars value={r.rating} />{r.is_verified_purchase && <span className="flex items-center gap-1 text-xs text-sage"><BadgeCheck size={14} />Verified purchase</span>}</div>
            {r.title && <h4 className="mt-2 font-sans font-semibold">{r.title}</h4>}
            {r.body && <p className="mt-1 text-sm text-muted">{r.body}</p>}
            <p className="mt-2 text-xs text-muted">{formatDate(r.created_at)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
