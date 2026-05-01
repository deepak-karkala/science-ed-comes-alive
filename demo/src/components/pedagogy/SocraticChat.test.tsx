import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SocraticChat } from './SocraticChat';

const fetchMock = vi.fn();

describe('SocraticChat', () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('posts typed lesson, language, and verified simulation state to the API routes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', fetchMock);
    const simulationState = {
      is_verified: true as const,
      emf: 0.25,
      current: 0.025,
      bulbBrightness: 0.125,
      electronDensity: 0.2,
    };

    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: { tag: 'ELECTRICITY_STORED_MYTH', confidence: 0.85 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response('data: {"text":"That\'s an interesting observation!"}\n\ndata: [DONE]\n\n', {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        }),
      );

    render(
      <SocraticChat
        lessonId="1"
        language="hi"
        subject="physics"
        simulationState={simulationState}
        onExchange={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText(/ask a question or explain your hypothesis/i), 'I think the battery stores electricity');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/misconception',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          lessonId: '1',
          studentResponse: 'I think the battery stores electricity',
        }),
      }),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/socratic',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          lessonId: '1',
          language: 'hi',
          sessionHistory: [
            { role: 'assistant', content: 'Hello! What did you notice in the simulation?' },
          ],
          simState: simulationState,
          studentMessage: 'I think the battery stores electricity',
        }),
      }),
    );
  });
});
