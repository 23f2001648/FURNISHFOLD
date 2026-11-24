import { Badge } from "@/components/ui/badge";
import type { Address } from "@/types/user";
export function AddressBlock({ a }: { a: Address }) {
  return (
    <div className="text-sm leading-relaxed">
      <p className="font-medium">{a.full_name} {a.is_default && <Badge className="ml-1">Default</Badge>}</p>
      <p className="text-muted">{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state} {a.postal_code}<br />{a.phone}</p>
    </div>
  );
}
