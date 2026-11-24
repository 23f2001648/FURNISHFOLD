import { PAYMENT_METHODS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
export function PaymentOptions({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {PAYMENT_METHODS.map((m) => (
        <label key={m.value} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4", value === m.value ? "border-ink bg-white" : "border-line hover:border-ink/50")}>
          <input type="radio" name="pay" checked={value === m.value} onChange={() => onChange(m.value)} className="mt-1 accent-clay" />
          <span><span className="block text-sm font-medium">{m.label}</span><span className="text-xs text-muted">{m.hint}</span></span>
        </label>
      ))}
    </div>
  );
}
