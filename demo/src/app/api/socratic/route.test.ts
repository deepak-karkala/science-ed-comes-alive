import { afterEach, describe, expect, it, vi } from 'vitest';

describe('POST /api/socratic', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    vi.resetModules();
  });

  it('streams deterministic fixture chunks in DEMO_MODE', async () => {
    process.env.DEMO_MODE = 'true';
    delete process.env.OPENAI_API_KEY;

    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/socratic', {
        method: 'POST',
        body: JSON.stringify({
          lessonId: '1',
          language: 'en',
          sessionHistory: [],
          simState: { is_verified: true, emf: 0, current: 0, bulbBrightness: 0, electronDensity: 0 },
          studentMessage: 'Why is the bulb dark?',
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    const text = await response.text();
    expect(text).toContain('That\'s an interesting observation!');
    expect(text).toContain('[DONE]');
  });

  it('fails with a clear error when demo mode is off and no API key is configured', async () => {
    process.env.DEMO_MODE = 'false';
    delete process.env.OPENAI_API_KEY;

    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/socratic', {
        method: 'POST',
        body: JSON.stringify({
          lessonId: '1',
          language: 'en',
          sessionHistory: [],
          simState: { is_verified: true, emf: 0, current: 0, bulbBrightness: 0, electronDensity: 0 },
          studentMessage: 'Why is the bulb dark?',
        }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining('OpenAI API Key is missing'),
    });
  });
});
