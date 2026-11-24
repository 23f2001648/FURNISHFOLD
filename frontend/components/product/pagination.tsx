import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} />Prev</Button>
      <span className="text-sm text-muted">Page {page} of {total}</span>
      <Button variant="outline" size="sm" disabled={page >= total} onClick={() => onChange(page + 1)}>Next<ChevronRight size={16} /></Button>
    </div>
  );
}
