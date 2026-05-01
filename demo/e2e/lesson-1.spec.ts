import { test, expect } from '@playwright/test';

test.describe('Lesson 1: EM Induction (Investor Path)', () => {
  // Use DEMO_MODE logic, which implies fixture responses
  test.use({ locale: 'en-US' });

  test('completes predict -> experiment -> explain -> apply flow', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', exception => console.log('BROWSER ERROR:', exception));

    await page.goto('/lesson/1');
    await page.waitForLoadState('networkidle');
    const textContent = await page.textContent('body');
    console.log('PAGE TEXT CONTENT:', textContent);

    // 1. PREDICT phase
    await expect(page.locator('header')).toContainText('PHASE:', { timeout: 15000 });
    await expect(page.locator('header')).toContainText('PREDICT');

    // Verify simulation area is initialized (canvas should exist)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached();

    // Socratic chat should be locked initially or predict prompt should show
    const predictInput = page.getByPlaceholder('Type your hypothesis here...');
    await expect(predictInput).toBeVisible();
    
    // Submit prediction
    await predictInput.fill('Maybe the magnet pushes the electrons');
    await page.getByRole('button', { name: /Next/i }).click();

    // 2. EXPERIMENT phase
    await expect(page.getByText('EXPERIMENT')).toBeVisible();
    await expect(page.getByText('Socratic chat is locked')).toBeVisible();

    // Interact with controls
    const velocitySlider = page.getByRole('slider', { name: /Speed/i });
    if (await velocitySlider.isVisible()) {
      // If sliders are native inputs:
      await velocitySlider.fill('10');
    } else {
      // Fallback interaction if it's a custom control (just click it)
      await page.mouse.click(100, 100); 
    }
    
    // The interaction should automatically transition to EXPLAIN
    await expect(page.getByText('EXPLAIN')).toBeVisible();

    // 3. EXPLAIN phase
    await expect(page.getByPlaceholder('Ask a question or explain your hypothesis...')).toBeVisible();

    // Type the misconception keyword "battery"
    await page.getByPlaceholder('Ask a question or explain your hypothesis...').fill('I think the battery stores electricity');
    await page.getByRole('button', { name: /Send/i }).click();

    // Verify misconception alert
    await expect(page.getByText('The tutor is adjusting its strategy')).toBeVisible();
    await expect(page.getByText('ELECTRICITY_STORED_MYTH')).toBeVisible();
    
    // Check that we got a reply (in demo mode, it's deterministic)
    await expect(page.getByText('That\'s an interesting observation!')).toBeVisible();

    // Do another turn to trigger APPLY
    await page.getByPlaceholder('Ask a question or explain your hypothesis...').fill('Okay, I understand now');
    await page.getByRole('button', { name: /Send/i }).click();

    // 4. APPLY phase
    await expect(page.getByText('APPLY')).toBeVisible();
    await expect(page.getByText('Knowledge Applied')).toBeVisible();
  });
});
