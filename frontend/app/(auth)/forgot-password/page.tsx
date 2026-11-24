import { Suspense } from "react";
import { ForgotForm } from "@/features/auth/forgot-form";
export const metadata = { title: "Forgot password" };
export default function Page() { return <Suspense><ForgotForm /></Suspense>; }
