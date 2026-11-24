"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddressBlock } from "@/components/account/address-card";
import { AddressForm } from "@/components/account/address-form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { userApi } from "@/lib/api/endpoints";
import type { Address } from "@/types/user";

export default function AddressesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["addresses"], queryFn: userApi.addresses });
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const done = () => { qc.invalidateQueries({ queryKey: ["addresses"] }); setEditing(null); };
  const onError = (e: Error) => toast.error(e.message);
  const save = useMutation({
    mutationFn: (d: Parameters<typeof userApi.addAddress>[0]) => editing && editing !== "new" ? userApi.updateAddress(editing.id, d) : userApi.addAddress(d),
    onSuccess: () => { toast.success("Address saved"); done(); }, onError,
  });
  const remove = useMutation({ mutationFn: userApi.deleteAddress, onSuccess: () => { toast.success("Address removed"); done(); }, onError });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-4xl">Addresses</h1>{!editing && <Button size="sm" onClick={() => setEditing("new")}><Plus size={16} />Add address</Button>}</div>
      {editing && (
        <div className="rounded-card border border-line bg-white p-6">
          <AddressForm initial={editing === "new" ? undefined : editing} loading={save.isPending} onCancel={() => setEditing(null)} onSubmit={(d) => save.mutate({ ...d, line2: d.line2 || null })} />
        </div>
      )}
      {data?.length === 0 && !editing && <EmptyState title="No saved addresses" text="Add one now to speed up checkout." />}
      <div className="grid gap-4 sm:grid-cols-2">
        {data?.map((a) => (
          <div key={a.id} className="space-y-3 rounded-card border border-line bg-white p-5">
            <AddressBlock a={a} />
            <div className="flex gap-4 text-sm"><button className="text-clay hover:underline" onClick={() => setEditing(a)}>Edit</button><button className="text-red-600 hover:underline" onClick={() => confirm("Delete this address?") && remove.mutate(a.id)}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
