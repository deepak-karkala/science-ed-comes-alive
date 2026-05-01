import { afterEach, describe, expect, it, vi } from 'vitest';

describe('POST /api/misconception', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    vi.resetModules();
  });

  it('returns heuristic misconception results in DEMO_MODE without an API key', async () => {
    process.env.DEMO_MODE = 'true';
    delete process.env.OPENAI_API_KEY;

    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/misconception', {
        method: 'POST',
        body: JSON.stringify({
          lessonId: '1',
          studentResponse: 'The wire already has electricity stored inside it.',
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      result: {
        tag: 'ELECTRICITY_STORED_MYTH',
      },
    });
  });

  it('rejects requests missing typed contract fields', async () => {
    process.env.DEMO_MODE = 'true';

    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/misconception', {
        method: 'POST',
        body: JSON.stringify({
          text: 'battery',
          subject: 'physics',
        }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
