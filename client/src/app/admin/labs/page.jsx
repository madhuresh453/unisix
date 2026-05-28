import { AdminRouteShell } from "@/components/admin/AdminRouteShell";

export default function Page() {
  return (
    <AdminRouteShell title="Admin labs">
      Manage labs with RBAC-protected endpoints under <code>/api/learning/admin</code>.
    </AdminRouteShell>
  );
}
