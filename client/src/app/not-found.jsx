import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/ui/PageShell";

export default function NotFound() {
  return (
    <PageShell className="grid min-h-[calc(100vh-10rem)] place-items-center text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyber-red">404</p>
        <h1 className="mt-3 text-4xl font-black uppercase">Signal not found</h1>
        <p className="mt-4 w-full text-cyber-muted">The route, event, writeup, or challenge you requested does not exist.</p>
        <Button href="/" className="mt-8">Return home</Button>
      </div>
    </PageShell>
  );
}
