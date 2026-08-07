import { NextResponse } from 'next/server';
import { ASK_JSON_SCHEMA, type AskResponse } from './schema';
import { buildSystemPrompt } from './content';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const body = await request.json();
    const prompt = body.prompt || '';
    const audienceHint = ['recruiter', 'founder', 'researcher', 'general'].includes(body.audienceHint)
      ? body.audienceHint
      : null;

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(audienceHint) },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_schema', json_schema: ASK_JSON_SCHEMA },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || error.message}`);
    }

    const data = await response.json();
    const parsed: AskResponse = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Ask API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Ask API is running' });
}
