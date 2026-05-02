import { test, expect } from '@playwright/test';

test.describe('Lesson 2: Acid-Base pH (Investor Path)', () => {
  test.use({ locale: 'en-US' });

  test('completes predict -> experiment -> explain flow with substance mixing', async ({ page }) => {
    await page.goto('/lesson/2');
    await page.waitForLoadState('networkidle');

    // 1. PREDICT phase
    await expect(page.locator('header')).toContainText('PHASE:');
    await expect(page.locator('header')).toContainText('PREDICT');

    // SVG beaker should be present
    const svg = page.locator('svg');
    await expect(svg).toBeAttached({ timeout: 15000 });

    // Submit prediction
    const predictInput = page.getByPlaceholder('Type your hypothesis here...');
    await expect(predictInput).toBeVisible();
    await predictInput.fill('Mixing acid and base will move pH toward neutral');
    await page.getByRole('button', { name: /Next/i }).click();

    // 2. EXPERIMENT phase
    await expect(page.getByText('EXPERIMENT')).toBeVisible();

    // pH readout should show neutral 7.0 initially
    await expect(page.getByText('pH VALUE')).toBeVisible();
    await expect(page.getByText('7.0')).toBeVisible();

    // Click a substance (lemon juice, pH 2.5)
    const lemonButton = page.getByRole('button', { name: /नींबू पानी/i });
    await expect(lemonButton).toBeVisible();
    await lemonButton.click();

    // pH should change from 7.0
    await expect(page.getByText('2.5')).toBeVisible();

    // Should transition to EXPLAIN after interaction
    await expect(page.locator('header')).toContainText('EXPLAIN');

    // Now add antacid (Digene, pH 9.5) — should neutralize toward 6.0
    const antacidButton = page.getByRole('button', { name: /डाइजीन/i });
    await expect(antacidButton).toBeVisible();
    await antacidButton.click();

    // Weighted average: (2.5 + 9.5) / 2 = 6.0
    await expect(page.getByText('6.0')).toBeVisible();

    // Socratic chat is now available
    const chatInput = page.getByPlaceholder('Ask a question or explain your hypothesis...');
    await expect(chatInput).toBeVisible();
  });

  test('substance color indicator updates on the beaker', async ({ page }) => {
    await page.goto('/lesson/2');
    await page.waitForLoadState('networkidle');

    // Skip prediction
    const predictInput = page.getByPlaceholder('Type your hypothesis here...');
    await predictInput.fill('Test');
    await page.getByRole('button', { name: /Next/i }).click();

    // Click soda water (pH 5.5, color #CCEE44)
    await page.getByRole('button', { name: /सोडा वाटर/i }).click();

    // Color hex should be visible in the overlay
    await expect(page.getByText('#CCEE44')).toBeVisible();
    await expect(page.getByText('5.5')).toBeVisible();

    // Click baking soda (pH 8.5, color #88BBFF)
    await page.getByRole('button', { name: /खाने का सोडा/i }).click();

    // Weighted average of 5.5 and 8.5 = 7.0
    await expect(page.getByText('7.0')).toBeVisible();
    // Should NOT still show #CCEE44 (now mixture, not single substance)
    await expect(page.getByText('#CCEE44')).not.toBeVisible();
  });
});
