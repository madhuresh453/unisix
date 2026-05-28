"use client";
import { EventAdminShell } from "@/components/admin/EventAdminShell";
export default function Page({ params }) { return <EventAdminShell slug={params?.eventId} title="Event Notifications">Manage event notifications.</EventAdminShell>; }
