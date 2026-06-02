const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const stamp = process.env.OPS_EVIDENCE_STAMP || 'baby-care-planner-20260602';
const screenshotDir = path.join('reports', 'screenshots', 'baby-care-planner-20260602');
fs.mkdirSync(screenshotDir, { recursive: true });

async function scrollWithHeaderOffset(page, selector) {
  await page.locator(selector).evaluate((element) => {
    const y = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo(0, Math.max(0, y));
  });
}

async function fillPlanner(page) {
  await page.locator('#baby-care-name').fill('또또');
  await page.locator('#baby-care-date').fill('2026-06-10');
  await page.locator('#baby-care-place').fill('호치민 소아과');
  await page.locator('#baby-care-purpose').selectOption('예방접종 기록 확인');
  await page.locator('#baby-care-memo').fill('접종 카드 사진, 최근 발열 없음, 땅콩 알레르기 메모');
  await page.getByRole('button', { name: '방문 메모 만들기' }).click();
}

test('baby care planner fits mobile and creates a practical visit memo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto('http://127.0.0.1:8000/baby.html', { waitUntil: 'domcontentloaded' });
  await scrollWithHeaderOffset(page, '#baby-care-planner');
  await fillPlanner(page);

  await expect(page.locator('#baby-care-result')).toBeVisible();
  await expect(page.locator('#baby-care-result-title')).toContainText('또또 방문 전 확인 메모');
  await expect(page.locator('#baby-care-result')).toContainText('호치민 소아과');
  await expect(page.locator('#baby-care-result')).toContainText('접종 카드와 이전 병원 기록 사진');
  await expect(page.locator('.baby-care-note')).toContainText('담당 의료진과 병원 안내를 우선');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  const cardBox = await page.locator('#baby-care-planner').boundingBox();
  expect(cardBox.width).toBeLessThanOrEqual(390);

  await scrollWithHeaderOffset(page, '#baby-care-planner');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-mobile-390.png`),
    fullPage: false
  });
});

test('baby care planner desktop view and checklist link match their purpose', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('http://127.0.0.1:8000/baby.html', { waitUntil: 'domcontentloaded' });
  await scrollWithHeaderOffset(page, '#baby-care-planner');
  await fillPlanner(page);

  const href = await page.getByRole('link', { name: '접종 기록 체크리스트 보기' }).getAttribute('href');
  expect(href).toBe('guides/han-viet-vaccine-checklist.html');

  await page.goto('http://127.0.0.1:8000/guides/han-viet-vaccine-checklist.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toContainText('한-베 아이 예방접종 기록 메모');
  await expect(page.locator('body')).toContainText('접종 카드 사진');
  await expect(page.locator('body')).toContainText('담당 의료진과 병원 안내');

  await page.goto('http://127.0.0.1:8000/baby.html', { waitUntil: 'domcontentloaded' });
  await scrollWithHeaderOffset(page, '#baby-care-planner');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-desktop-1366.png`),
    fullPage: false
  });
});
