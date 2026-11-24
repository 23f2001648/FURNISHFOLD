import { AccountNav } from "@/components/account/account-nav";
import { AuthGuard } from "@/features/auth/auth-guard";
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="container-ff grid gap-8 py-12 md:grid-cols-[14rem_1fr]">
        <AccountNav /><div className="min-w-0">{children}</div>
      </div>
    </AuthGuard>
  );
}
