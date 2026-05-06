"use client";

import { useState } from "react";
import { LockOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HintUnlockList({ hints }) {
  const [unlocked, setUnlocked] = useState([]);

  return (
    <div className="grid gap-3">
      {hints.map((hint, index) => {
        const isUnlocked = unlocked.includes(index);
        return (
          <div key={hint.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold uppercase">{hint.title}</p>
                <p className="mt-1 text-sm text-cyber-muted">{hint.cost} point deduction</p>
              </div>
              {!isUnlocked ? (
                <Button
                  icon={LockOpen}
                  variant="secondary"
                  onClick={() => setUnlocked((items) => [...items, index])}
                >
                  Unlock
                </Button>
              ) : null}
            </div>
            {isUnlocked ? <p className="mt-4 leading-7 text-cyber-muted">{hint.body}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
