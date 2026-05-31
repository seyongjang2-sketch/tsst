const { test, expect } = require('@playwright/test');
const path = require('path');

const targets = [
  ['remote', 'https://tsst-csa.pages.dev/?check=extended-ops-20260531'],
  ['local', 'http://127.0.0.1:8000/index.html']
];

const viewports = [
  ['desktop', { width: 1366, height: 900 }],
  ['mobile', { width: 390, height: 720 }]
];

for (const [targetName, url] of targets) {
  for (const [viewportName, viewport] of viewports) {
    test(`${targetName} ${viewportName} operating console survives a real daily run`, async ({ page }) => {
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));

      await page.setViewportSize(viewport);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => window.localStorage.removeItem('familyspace.opsConsole.v1'));
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#ops-title').scrollIntoViewIfNeeded();

      await expect(page.locator('#opsProgressLabel')).toHaveText('1/5');

      const seenProgress = [];
      for (let index = 0; index < 4; index += 1) {
        await page.locator('#opsNextButton').click();
        seenProgress.push(await page.locator('#opsProgressLabel').innerText());
      }
      expect(seenProgress).toEqual(['2/5', '3/5', '4/5', '5/5']);
      await expect(page.locator('#opsNextButton')).toBeDisabled();

      const completeLogCount = await page.locator('#opsLog .fs-log-row').count();
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#ops-title').scrollIntoViewIfNeeded();
      await expect(page.locator('#opsProgressLabel')).toHaveText('5/5');
      await expect(page.locator('#opsNextButton')).toBeDisabled();
      await expect(page.locator('#opsLog .fs-log-row')).toHaveCount(completeLogCount);

      await page.locator('#opsResetButton').click();
      await expect(page.locator('#opsProgressLabel')).toHaveText('1/5');
      await expect(page.locator('#opsNextButton')).toBeEnabled();
      await expect(page.locator('#opsLog .fs-log-row')).toHaveCount(1);

      const sideBox = await page.locator('.fs-ops-side').boundingBox();
      expect(sideBox.width).toBeLessThanOrEqual(viewport.width + 2);
      const drawerBox = await page.locator('#roomDrawer').boundingBox();
      const opsBox = await page.locator('.fs-ops').boundingBox();
      const drawerOverlapsOps = drawerBox.y < opsBox.y + opsBox.height && drawerBox.y + drawerBox.height > opsBox.y;
      expect(drawerOverlapsOps).toBe(false);

      await page.screenshot({
        path: path.join('reports', 'screenshots', `index-ops-extended-${targetName}-${viewportName}-20260531.png`),
        fullPage: true
      });

      expect(consoleErrors).toEqual([]);
    });
  }
}
