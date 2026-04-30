// Fixtures for DEMO_MODE without requiring an OpenAI API key

export const DEMO_SOCRATIC_CHUNKS = [
  "That's an interesting observation! ",
  "When you moved the wire faster, ",
  "you noticed the bulb got brighter. ",
  "Why do you think the speed of the wire ",
  "affects the amount of electricity generated? ",
  "Think about what the wire is cutting through."
];

export async function simulateStreamingResponse(
  onChunk: (chunk: string) => void,
  delayMs = 100
) {
  for (const chunk of DEMO_SOCRATIC_CHUNKS) {
    onChunk(chunk);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
}
