'use client'

import { useEffect, useRef, useState } from 'react'
import GlassChip from '../ui/chips/glass-chip'
import { PictureGlassCard } from '../ui/cards/picture-glass-card'
import { GlassCardText } from '../ui/cards/glass-card'
import type { AskBlock, AskResponse, ImageId } from '../../api/ask/schema'

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; layout: AskBlock[] }
  | { id: string; role: 'error'; text: string }

const AUDIENCES = [
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'founder', label: 'Founder' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'general', label: 'Just browsing' },
] as const

// Real asset paths for the curated imageIds the model is allowed to pick from.
const IMAGE_MAP: Record<ImageId, string> = {
  'rever-home': '/images/rever-home.png',
  'local-legends': '/images/local-legends.png',
  'co-daftar': '/images/co-daftar.png',
  'plinth': 'https://tse2.mm.bing.net/th/id/OIP._8Ky0CER14gez9Mn61K7xwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
}

function AskBlockCard({ block }: { block: AskBlock }) {
  if (block.template === 'project') {
    return (
      <PictureGlassCard
        image={block.imageId ? IMAGE_MAP[block.imageId] : ''}
        caption={block.title ?? undefined}
        summary={block.summary ?? undefined}
        link={block.link ?? undefined}
      />
    )
  }

  if (block.template === 'skills') {
    return (
      <GlassCardText className="flex flex-wrap gap-2 py-4">
        {(block.items ?? []).map((item) => (
          <GlassChip key={item}>{item}</GlassChip>
        ))}
      </GlassCardText>
    )
  }

  // research, contact, prose all render as title/summary/body/link text
  return (
    <GlassCardText className="text-left">
      <div className="space-y-2 py-3">
        {block.title && <h3 className="text-lg font-semibold">{block.title}</h3>}
        {block.summary && <p className="text-base opacity-80">{block.summary}</p>}
        {block.body && <p className="text-base opacity-80">{block.body}</p>}
        {block.link && (
          <a href={block.link} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors inline-block pt-1">
            {block.link}
          </a>
        )}
      </div>
    </GlassCardText>
  )
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [audience, setAudience] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const historyContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = historyContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const askedQuery = query.trim()
    if (!askedQuery) return

    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: askedQuery }])
    setQuery('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: askedQuery, audienceHint: audience }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to get an answer')

      const askResponse = data as AskResponse
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', layout: askResponse.layout }])
    } catch (err) {
      console.error('Ask error:', err)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'error', text: 'Something went wrong — try again in a moment.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 mx-auto">
      {/* Audience selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {AUDIENCES.map((a) => (
          <GlassChip
            key={a.id}
            variant={audience === a.id ? 'primary' : 'outline'}
            onClick={() => setAudience(audience === a.id ? null : a.id)}
          >
            {a.label}
          </GlassChip>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="mb-6 rounded-2xl bg-black/[0.06] border border-black/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] p-4">
          <div ref={historyContainerRef} className="max-h-[28rem] overflow-y-auto space-y-4 text-left pr-1">
            {messages.map((message) => {
              if (message.role === 'user') {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="inline-block w-fit max-w-[80%] rounded-2xl bg-black/10 border border-black/20 px-4 py-2 text-sm text-black">
                      {message.text}
                    </div>
                  </div>
                )
              }

              if (message.role === 'error') {
                return (
                  <p key={message.id} className="text-sm text-black/60">
                    {message.text}
                  </p>
                )
              }

              return (
                <div key={message.id} className="space-y-4">
                  {message.layout.map((block, i) => (
                    <AskBlockCard key={i} block={block} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about my projects, stack, or how to reach me..."
          disabled={isLoading}
          className="w-full pl-6 pr-24 py-5 rounded-2xl bg-black/10 border border-black/20 text-black placeholder-black/50 text-base md:text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_40px_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-black/40 focus:bg-black/15"
        />

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            !query.trim() || isLoading
              ? 'text-black/30'
              : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
          }`}
        >
          {isLoading ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  )
}

export default SearchBar
