"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Sparkles } from "lucide-react"
import type { AskBlock, AskResponse } from "../../api/ask/schema"
import { parsePartialJSON } from "./partial-json"
import AnswerBlock from "./answer-blocks"

const SUGGESTIONS = [
  "What have you built?",
  "Can you build an ERP for my business?",
  "What's your experience with AI?",
  "Tell me about your research",
  "How do I hire you?",
]

type Entry = { id: number; question: string; layout: AskBlock[]; status: "streaming" | "done" | "error"; error?: string }

// "Ask about my work": an AI assistant grounded in the site's content. Answers stream in as JSON and
// render progressively with the site's own card templates (see answer-blocks.tsx). If the API is
// unavailable it shows a short message; the rest of the portfolio below works without it.
export default function AskTower() {
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState<Entry[]>([])
  const [busy, setBusy] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  function update(id: number, patch: Partial<Entry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  async function ask(question: string) {
    const q = question.trim()
    if (!q || busy) return
    const id = nextId.current++
    setEntries((prev) => [...prev, { id, question: q, layout: [], status: "streaming" }])
    setQuery("")
    setBusy(true)

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "The assistant is unavailable right now")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        const partial = parsePartialJSON<Partial<AskResponse>>(text)
        if (partial?.layout) update(id, { layout: partial.layout.filter((b) => b && b.template) })
      }
      const final = parsePartialJSON<AskResponse>(text)
      if (!final?.layout?.length) throw new Error("No answer came through, please try again")
      update(id, { layout: final.layout, status: "done" })
    } catch (err) {
      update(id, { status: "error", error: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative border border-white/10 panel text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-3 border-b border-white/10 text-[10px] sm:text-xs tracking-[0.25em]">
        <span className="flex items-center gap-2 font-semibold">
          <Sparkles className="w-4 h-4 text-accent-ink" />
          ASK ABOUT MY WORK
        </span>
        <span className="flex items-center gap-1.5 text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" aria-hidden="true" />
          AI · ANSWERS FROM THIS SITE
        </span>
      </div>

      {entries.length > 0 && (
        <div ref={logRef} className="max-h-[32rem] overflow-y-auto px-5 sm:px-6 py-4 space-y-5" aria-live="polite">
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-3">
              <div className="flex justify-end">
                <span className="max-w-[85%] rounded-xl rounded-br-sm bg-white/10 px-3.5 py-2 text-sm">{entry.question}</span>
              </div>
              {entry.layout.map((block, i) => (
                <AnswerBlock key={i} block={block} />
              ))}
              {entry.status === "streaming" && entry.layout.length === 0 && (
                <p className="text-xs tracking-[0.2em] text-white/50 motion-safe:animate-pulse">THINKING…</p>
              )}
              {entry.status === "error" && <p className="text-sm text-white/60">{entry.error}. The portfolio below has everything too.</p>}
            </div>
          ))}
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 pt-3 space-y-3">
        {entries.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-accent/60 hover:text-white transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(query)
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={400}
            placeholder="Ask about projects, services, or how to work together…"
            aria-label="Ask about my work"
            className="flex-1 min-w-0 rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-accent/60 transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim() || busy}
            className="btn btn-primary btn-sm"
          >
            <span className="hidden sm:inline">{busy ? "…" : "Ask"}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
