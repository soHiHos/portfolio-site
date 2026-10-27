import { NextResponse } from 'next/server';
import { ASK_JSON_SCHEMA } from './schema';
import { buildSystemPrompt } from './content';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// Default model handles intent + slot filling; the escalation model only runs when the default
// flags low confidence (ambiguous template choice / freeform prose answer).
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const ESCALATION_MODEL = process.env.OPENAI_ESCALATION_MODEL || 'gpt-4o';

const MAX_PROMPT_CHARS = 400;
const MAX_TOKENS = 600;

// Best-effort per-IP rate limit (in-memory, per serverless instance) to protect the API budget
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function openAIStream(model: string, prompt: string) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: MAX_TOKENS,
      stream: true,
      response_format: { type: 'json_schema', json_schema: ASK_JSON_SCHEMA },
    }),
  });
}

// Yields the text deltas from an OpenAI server-sent-events response
async function* contentDeltas(res: Response) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const data = line.replace(/^data: /, '').trim();
        if (!data || data === '[DONE]') continue;
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) yield delta as string;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Streams the answer as raw JSON text (the client parses it progressively). The default model's
// output is buffered until its leading scope/confidence values and first block template are known.
// It escalates to the stronger model for a freeform prose answer to an on-topic question (the
// ProseCard fallback) or when the default model reports low confidence; otherwise the buffered
// text is flushed and streaming continues. Off-topic answers never escalate.
function shouldEscalate(buffered: string): boolean | null {
  const scope = buffered.match(/"scope"\s*:\s*"(portfolio|off_topic)"/)?.[1];
  const confidence = buffered.match(/"confidence"\s*:\s*"(high|low)"/)?.[1];
  const template = buffered.match(/"template"\s*:\s*"(\w+)"/)?.[1];
  if (!scope || !confidence) return null;
  if (scope === 'off_topic') return false;
  if (confidence === 'low') return true;
  if (!template) return null;
  return template === 'prose';
}

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Assistant is not configured' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many questions, try again in a few minutes' }, { status: 429 });
  }

  let prompt = '';
  try {
    prompt = String((await request.json()).prompt ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json({ error: `Please keep questions under ${MAX_PROMPT_CHARS} characters` }, { status: 400 });
  }

  const first = await openAIStream(DEFAULT_MODEL, prompt);
  if (!first.ok || !first.body) {
    console.error('Ask API error:', first.status, await first.text().catch(() => ''));
    return NextResponse.json({ error: 'The assistant is unavailable right now' }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let buffered = '';
        let decided = false;
        for await (const delta of contentDeltas(first)) {
          if (decided) {
            controller.enqueue(encoder.encode(delta));
            continue;
          }
          buffered += delta;
          const escalate = shouldEscalate(buffered);
          if (escalate === null) continue;
          decided = true;
          if (!escalate) {
            controller.enqueue(encoder.encode(buffered));
            continue;
          }
          // Low confidence: switch to the escalation model
          console.info(`ask: escalating from ${DEFAULT_MODEL} to ${ESCALATION_MODEL}`);
          const second = await openAIStream(ESCALATION_MODEL, prompt);
          if (!second.ok || !second.body) {
            controller.enqueue(encoder.encode(buffered)); // fall back to the default model's answer
            decided = true;
            continue;
          }
          for await (const d of contentDeltas(second)) controller.enqueue(encoder.encode(d));
          break;
        }
      } catch (error) {
        console.error('Ask stream error:', error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function GET() {
  return NextResponse.json({ message: 'Ask API is running' });
}
