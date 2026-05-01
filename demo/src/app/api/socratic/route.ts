import { NextResponse } from 'next/server';
import { DEMO_SOCRATIC_CHUNKS } from '../../../lib/ai/fixtures';
import { SocraticRequest } from '../../../lib/types/ai';
import OpenAI from 'openai';

// This is a minimal wrapper. In production, error handling would be more robust.
const isDemoMode = process.env.DEMO_MODE === 'true';
const openai = !isDemoMode && process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SocraticRequest>;
    const { lessonId, language, sessionHistory, simState, studentMessage } = body;

    if (!lessonId || !language || !studentMessage || !simState || simState.is_verified !== true) {
      return NextResponse.json(
        { error: 'Missing lessonId, language, studentMessage, or verified simState.' },
        { status: 400 }
      );
    }

    // Check for required configuration
    if (!isDemoMode && !openai) {
      return NextResponse.json(
        { error: 'OpenAI API Key is missing and DEMO_MODE is false. Please configure environment variables.' },
        { status: 500 }
      );
    }

    if (isDemoMode) {
      // Return a mocked SSE stream
      const stream = new ReadableStream({
        async start(controller) {
          for (const chunk of DEMO_SOCRATIC_CHUNKS) {
            const data = `data: ${JSON.stringify({ text: chunk })}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Production OpenAI Call
    const systemPrompt = `You are Vigyan Dost, a Socratic science tutor. 
    You never give direct answers. Instead, you ask guiding questions.
    Lesson route: ${lessonId}. Student language: ${language}.
    The current student simulation state is: ${JSON.stringify(simState)}.
    Guide them to understand the concepts based on their current state.`;

    const response = await openai!.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(sessionHistory || []),
        { role: 'user', content: studentMessage },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const data = `data: ${JSON.stringify({ text: content })}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
          }
        }
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Socratic API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing the request.' },
      { status: 500 }
    );
  }
}
