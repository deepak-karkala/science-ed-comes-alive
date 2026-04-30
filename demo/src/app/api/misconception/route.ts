import { NextResponse } from 'next/server';
import { classifyMisconception } from '../../../lib/ai/misconceptionClassifier';

const isDemoMode = process.env.DEMO_MODE === 'true';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, subject } = body;

    if (!text || !subject) {
      return NextResponse.json({ error: 'Missing text or subject' }, { status: 400 });
    }

    if (!isDemoMode && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key is missing and DEMO_MODE is false. Please configure environment variables.' },
        { status: 500 }
      );
    }

    // Since our misconception classifier is a fast local heuristic for now, 
    // we use it directly even in production (as per Task 9).
    // In a future advanced version, we might call OpenAI for zero-shot classification here.
    const result = classifyMisconception(text, subject);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Misconception API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing the request.' },
      { status: 500 }
    );
  }
}
