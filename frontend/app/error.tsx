"use client";
import { Button } from "@/components/ui/button";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-ff py-28 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">{error.message || "Please try again."}</p>
      <Button className="mt-8" onClick={reset}>Try again</Button>
    </div>
  );
}
