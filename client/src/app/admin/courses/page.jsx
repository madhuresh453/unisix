import { AdminRouteShell } from "@/components/admin/AdminRouteShell";

export default function Page() {
  return (
    <AdminRouteShell title="Admin courses">
      Manage courses with RBAC-protected endpoints under <code>/api/learning/admin</code>.
    </AdminRouteShell>
  );
}
