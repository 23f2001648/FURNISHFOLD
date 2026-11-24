import { cn } from "@/lib/utils/cn";
const tones = {
  neutral: "bg-cream text-ink", success: "bg-green-100 text-green-800", danger: "bg-red-100 text-red-800",
  warn: "bg-amber-100 text-amber-800", info: "bg-sky-100 text-sky-800", clay: "bg-clay text-white",
};
export const Badge = ({ tone = "neutral", className, children }: { tone?: keyof typeof tones; className?: string; children: React.ReactNode }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", tones[tone], className)}>{children}</span>
);
