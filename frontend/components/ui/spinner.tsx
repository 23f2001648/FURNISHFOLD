import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
export const Spinner = ({ className }: { className?: string }) => <Loader2 className={cn("size-6 animate-spin text-clay", className)} aria-label="Loading" />;
