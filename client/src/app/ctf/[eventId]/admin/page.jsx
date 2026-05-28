"use client";

import { EventAdminShell } from "@/components/admin/EventAdminShell";

export default function EventAdminPage({ params }) {
  const slug = params?.eventId;
  return <EventAdminShell slug={slug} title="Event Admin Dashboard">Event-scoped administration panel.</EventAdminShell>;
}
