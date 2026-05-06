"use client";

import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur">
      <div className="cyber-panel w-full rounded-xl p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black uppercase">{title}</h2>
          <Button variant="ghost" className="h-10 min-h-10 w-10 px-0" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
