import { NextResponse } from 'next/server';
import { classifyMisconception } from '../../../lib/ai/misconceptionClassifier';
import { getLessonById } from '../../../data/lessons';
import { MisconceptionRequest } from '../../../lib/types/ai';

const isDemoMode = process.env.DEMO_MODE === 'true';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MisconceptionRequest>;
    const { lessonId, studentResponse } = body;

    if (!lessonId || !studentResponse) {
      return NextResponse.json({ error: 'Missing lessonId or studentResponse' }, { status: 400 });
    }

    if (!isDemoMode && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key is missing and DEMO_MODE is false. Please configure environment variables.' },
        { status: 500 }
      );
    }

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Unknown lessonId' }, { status: 400 });
    }

    const result = classifyMisconception(studentResponse, lesson.subject);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Misconception API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing the request.' },
      { status: 500 }
    );
  }
}
