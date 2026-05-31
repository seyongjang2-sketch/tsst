const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const stamp = process.env.OPS_EVIDENCE_STAMP || 'step4-mobile-ui-local';
const screenshotDir = path.join('reports', 'screenshots', 'autonomous', stamp);
fs.mkdirSync(screenshotDir, { recursive: true });

const pages = [
  ['index', 'index.html', '.fs-links'],
  ['mom', 'mom.html', '.nav-links'],
  ['baby', 'baby.html', '.nav-links'],
  ['dad', 'dad.html', '.nav-links'],
  ['blog', 'blog.html', '.nav-links'],
  ['stars', 'stars.html', '.nav-links']
];

const expectedLabels = ['1층 엄마', '2층 아기', '3층 아빠', '4층 가족', '옥상'];

test.describe('roadmap step 4 mobile UI', () => {
  for (const [name, file, navSelector] of pages) {
    test(`${name} mobile viewport has common floor menu and no horizontal overflow`, async ({ page }) => {
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));

      await page.setViewportSize({ width: 390, height: 720 });
      await page.goto(`http://127.0.0.1:8000/${file}`, { waitUntil: 'domcontentloaded' });

      const labels = await page.locator(`${navSelector} a`).evaluateAll((links) =>
        links.slice(0, 5).map((link) => link.textContent.trim())
      );
      expect(labels).toEqual(expectedLabels);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        return Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth;
      });
      expect(overflow).toBeLessThanOrEqual(2);

      const navBox = await page.locator(navSelector).boundingBox();
      expect(navBox.width).toBeLessThanOrEqual(392);

      await page.screenshot({
        path: path.join(screenshotDir, `${name}-mobile-ui.png`),
        fullPage: false
      });

      const ignorable = consoleErrors.filter((message) => !message.includes('Firebase'));
      expect(ignorable).toEqual([]);
    });
  }

  test('baby interactive grid fits narrow screens after dynamic buttons render', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 720 });
    await page.goto('http://127.0.0.1:8000/baby.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#alphabet-board button').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
