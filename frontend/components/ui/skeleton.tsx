import { cn } from "@/lib/utils/cn";
export const Skeleton = ({ className }: { className?: string }) => <div className={cn("animate-pulse rounded-lg bg-cream", className)} />;
