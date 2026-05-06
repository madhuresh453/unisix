"use client";

import { useMemo } from "react";
import { events } from "@/utils/constants";

export function useCTF(status) {
  return useMemo(
    () => (status ? events.filter((event) => event.status === status) : events),
    [status]
  );
}
