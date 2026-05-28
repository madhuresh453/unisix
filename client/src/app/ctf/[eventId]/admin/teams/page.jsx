"use client";
import { EventAdminShell } from "@/components/admin/EventAdminShell";
export default function Page({ params }) { return <EventAdminShell slug={params?.eventId} title="Event Teams">Manage event teams.</EventAdminShell>; }
