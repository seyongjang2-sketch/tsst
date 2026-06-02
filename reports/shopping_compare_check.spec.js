const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const stamp = process.env.OPS_EVIDENCE_STAMP || 'shopping-compare-20260602';
const screenshotDir = path.join('reports', 'screenshots', 'shopping-compare-20260602');
fs.mkdirSync(screenshotDir, { recursive: true });

async function scrollWithHeaderOffset(page, selector) {
  await page.locator(selector).evaluate((element) => {
    const y = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo(0, Math.max(0, y));
  });
}

async function openShoppingCompare(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:8000/mom.html', { waitUntil: 'networkidle' });
  await scrollWithHeaderOffset(page, '.shopping-compare-board');
}

test('shopping quick compare fits mobile and explains each link purpose', async ({ page }) => {
  await openShoppingCompare(page, { width: 390, height: 720 });

  await expect(page.locator('.shopping-compare-card')).toHaveCount(3);
  await expect(page.locator('.shopping-compare-board')).toContainText('WinMart');
  await expect(page.locator('.shopping-compare-board')).toContainText('Lotte Mart');
  await expect(page.locator('.shopping-compare-board')).toContainText('K-Market');
  await expect(page.locator('.shopping-compare-board')).toContainText('정책·구매 조건 보기');
  await expect(page.locator('.shopping-compare-board')).toContainText('행사·배달 보기');
  await expect(page.locator('.shopping-compare-board')).toContainText('한국 식재료 보기');
  await expect(page.locator('.shopping-compare-note')).toContainText('구매 확정표가 아니라 확인 순서');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  const boardBox = await page.locator('.shopping-compare-board').boundingBox();
  expect(boardBox.width).toBeLessThanOrEqual(390);

  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-mobile-390.png`),
    fullPage: false
  });
});

test('shopping quick compare desktop links match their promises', async ({ page }) => {
  await openShoppingCompare(page, { width: 1366, height: 900 });

  const links = await page.locator('.shopping-compare-card a').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      text: anchor.textContent.trim(),
      href: anchor.href
    }))
  );

  expect(links).toEqual([
    {
      text: '정책·구매 조건 보기',
      href: 'https://winmart.vn/info/transaction-policy'
    },
    {
      text: '행사·배달 보기',
      href: 'https://www.lottemart.vn/'
    },
    {
      text: '한국 식재료 보기',
      href: 'https://k-market.vn/en/k-market/'
    }
  ]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-desktop-1366.png`),
    fullPage: false
  });
});
