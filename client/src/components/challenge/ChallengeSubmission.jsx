"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { submitFlag } from "@/services/challengeService";
import { isFlag } from "@/utils/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ChallengeSubmission({ challengeId }) {
  const [flag, setFlag] = useState("");
  const [state, setState] = useState({ loading: false, message: "", ok: null });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFlag(flag)) {
      setState({ loading: false, message: "Flag format should look like UNI6{...}", ok: false });
      return;
    }

    setState({ loading: true, message: "Submitting flag", ok: null });

    try {
      const result = await submitFlag(challengeId, flag);
      setState({ loading: false, message: result.message || "Accepted", ok: true });
    } catch (error) {
      setState({ loading: false, message: error.message, ok: false });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cyber-panel rounded-xl p-5">
      <label className="text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted" htmlFor="flag">
        Submit flag
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Input
          id="flag"
          value={flag}
          onChange={(event) => setFlag(event.target.value)}
          placeholder="UNI6{flag_here}"
          className="flex-1"
        />
        <Button disabled={state.loading}>
          <Send className="h-4 w-4" />
          {state.loading ? "Checking" : "Submit"}
        </Button>
      </div>
      {state.message ? (
        <p className={`mt-3 text-sm ${state.ok ? "text-emerald-300" : "text-cyber-red"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
