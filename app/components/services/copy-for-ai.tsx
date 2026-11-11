"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Copies the page as Markdown (built on the server from services.json), so a visitor can paste it into ChatGPT or
// similar and ask about it instead of reading the whole page. The label confirms the copy for two seconds.
export default function CopyForAi({ markdown }: { markdown: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} className="btn btn-secondary" aria-live="polite" title="Copy this page as text to paste into ChatGPT or another AI">
      {state === "copied" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : "Copy for AI"}
    </button>
  );
}
