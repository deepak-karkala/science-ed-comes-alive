import { test, expect } from '@playwright/test';

test.describe('Lesson 1: EM Induction (Investor Path)', () => {
  test.use({ locale: 'en-US' });

  test('completes predict -> experiment -> explain -> apply flow', async ({ page }) => {
    await page.goto('/lesson/1');
    await page.waitForLoadState('networkidle');

    // 1. PREDICT phase
    await expect(page.locator('header')).toContainText('PHASE:');
    await expect(page.locator('header')).toContainText('PREDICT');

    // Verify simulation canvas is attached
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached({ timeout: 15000 });

    // Prediction prompt should be visible
    const predictInput = page.getByPlaceholder('Type your hypothesis here...');
    await expect(predictInput).toBeVisible();

    // Submit prediction
    await predictInput.fill('I think the moving wire creates current in the circuit');
    await page.getByRole('button', { name: /Next/i }).click();

    // 2. EXPERIMENT phase
    await expect(page.getByText('EXPERIMENT')).toBeVisible();
    await expect(page.getByText('Socratic chat is locked')).toBeVisible();

    // Interact with the velocity slider to trigger transition to EXPLAIN
    // First, click a field preset button (also triggers onInteract)
    const presetButton = page.getByRole('button', { name: '0.5T' });
    await presetButton.click();

    // Should transition to EXPLAIN after simulation interaction
    await expect(page.locator('header')).toContainText('EXPLAIN');

    // 3. EXPLAIN phase — Socratic chat is now available
    const chatInput = page.getByPlaceholder('Ask a question or explain your hypothesis...');
    await expect(chatInput).toBeVisible();

    // Type the misconception keyword "battery" — should trigger ELECTRICITY_STORED_MYTH
    await chatInput.fill('I think the battery stores electricity inside');
    await page.getByRole('button', { name: /Send/i }).click();

    // Verify misconception alert fires
    await expect(page.getByText('ELECTRICITY_STORED_MYTH')).toBeVisible({ timeout: 10000 });

    // Wait for AI response in demo mode (deterministic fixture)
    await expect(page.getByText('interesting observation')).toBeVisible({ timeout: 10000 });

    // Second AI exchange should unlock APPLY
    await chatInput.fill('Okay, I understand — the motion is what generates electricity');
    await page.getByRole('button', { name: /Send/i }).click();

    // 4. APPLY phase — should appear after 2 AI exchanges
    await expect(page.locator('header')).toContainText('APPLY');
    await expect(page.getByText('Knowledge Applied')).toBeVisible();
    await expect(page.getByText(/How can you create electricity/)).toBeVisible();
  });
});
