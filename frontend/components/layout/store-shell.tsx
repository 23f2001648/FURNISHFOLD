import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
export const StoreShell = ({ children }: { children: React.ReactNode }) => (
  <><Navbar /><main className="min-h-[60vh]">{children}</main><Footer /></>
);
