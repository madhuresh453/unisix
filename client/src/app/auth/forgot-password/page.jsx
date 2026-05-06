import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/ui/PageShell";

export default function ForgotPasswordPage() {
  return (
    <PageShell className="grid min-h-[calc(100vh-10rem)] place-items-center">
      <form className="cyber-panel w-full rounded-xl p-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyber-red">Recovery</p>
        <h1 className="mt-3 text-3xl font-black uppercase">Reset password</h1>
        <Input
          type="email"
          placeholder="Email"
          className="mt-6"
        />
        <Button className="mt-5 w-full" icon={KeyRound}>Send reset link</Button>
      </form>
    </PageShell>
  );
}
