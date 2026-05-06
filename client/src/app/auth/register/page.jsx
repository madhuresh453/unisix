import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { PageShell } from "@/components/ui/PageShell";

export default function RegisterPage() {
  return (
    <PageShell className="grid min-h-[calc(100vh-10rem)] place-items-center">
      <div className="w-full">
        <AuthForm mode="register" />
        <p className="mt-5 text-center text-sm text-cyber-muted">
          Already registered? <Link className="font-bold text-cyber-red" href="/auth/login">Login</Link>
        </p>
      </div>
    </PageShell>
  );
}
