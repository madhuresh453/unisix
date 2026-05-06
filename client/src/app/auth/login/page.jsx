import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { PageShell } from "@/components/ui/PageShell";

export default function LoginPage() {
  return (
    <PageShell className="grid min-h-[calc(100vh-10rem)] place-items-center">
      <div className="w-full">
        <AuthForm mode="login" />
        <p className="mt-5 text-center text-sm text-cyber-muted">
          New to UNI6CTF? <Link className="font-bold text-cyber-red" href="/auth/register">Create an account</Link>
        </p>
      </div>
    </PageShell>
  );
}
