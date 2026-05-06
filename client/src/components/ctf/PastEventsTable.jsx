import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";

export function PastEventsTable({ events }) {
  return (
    <DataTable
      columns={["Event name", "Winners", "Participants", "Writeups"]}
      rows={events}
      renderRow={(event) => (
        <tr key={event.id} className="transition hover:bg-white/[0.03]">
          <td className="px-6 py-4 font-bold">{event.name}</td>
          <td className="px-6 py-4 text-cyber-muted">{event.winners.join(", ")}</td>
          <td className="px-6 py-4 tabular-nums text-cyber-muted">{event.participants}</td>
          <td className="px-6 py-4">
            <Link className="font-bold uppercase tracking-[0.12em] text-cyber-red" href="/writeups">
              Read
            </Link>
          </td>
        </tr>
      )}
    />
  );
}
