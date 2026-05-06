import { Sidebar } from "@/components/layout/Sidebar";
import { PageShell } from "@/components/ui/PageShell";

export default function DashboardLayout({ children }) {
  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>{children}</section>
      </div>
    </PageShell>
  );
}
