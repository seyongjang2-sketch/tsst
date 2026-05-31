const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const evidenceStamp = process.env.OPS_EVIDENCE_STAMP || new Date().toISOString().replace(/[:.]/g, '-');
const screenshotDir = path.join('reports', 'screenshots', 'autonomous', evidenceStamp);
fs.mkdirSync(screenshotDir, { recursive: true });

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
        path: path.join(screenshotDir, `index-ops-extended-${targetName}-${viewportName}.png`),
        fullPage: true
      });

      expect(consoleErrors).toEqual([]);
    });
  }
}

test('local first viewport explains audience, route, and private-test status', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: /한-베 가족 생활을 층별로 정리하는 FamilySpace/ })).toBeVisible();
  await expect(page.getByText('Private test · 공개 운영 전 검증 중')).toBeVisible();
  await expect(page.getByRole('link', { name: '1층 식단부터 보기' })).toHaveAttribute('href', 'mom.html');

  const floorLinks = [
    ['1층 엄마', /mom\.html$/],
    ['2층 아기', /baby\.html$/],
    ['3층 아빠', /dad\.html$/],
    ['4층 가족', /blog\.html$/],
    ['옥상', /stars\.html$/]
  ];

  const nav = page.locator('.fs-links');
  for (const [name, hrefPattern] of floorLinks) {
    await expect(nav.getByRole('link', { name })).toHaveAttribute('href', hrefPattern);
  }

  const heroBox = await page.locator('.fs-hero').boundingBox();
  const copyBox = await page.locator('.fs-hero-copy').boundingBox();
  const houseBox = await page.locator('.fs-house-stage').boundingBox();
  expect(copyBox.x + copyBox.width).toBeLessThanOrEqual(heroBox.x + heroBox.width + 2);
  expect(houseBox.x + houseBox.width).toBeLessThanOrEqual(heroBox.x + heroBox.width + 2);

  await page.screenshot({
    path: path.join(screenshotDir, 'index-first-viewport-local-mobile.png'),
    fullPage: false
  });

  expect(consoleErrors).toEqual([]);
});
