const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const stamp = process.env.OPS_EVIDENCE_STAMP || 'recipe-helper-cycle-20260602';
const screenshotDir = path.join('reports', 'screenshots', 'recipe-helper-cycle-20260602');
fs.mkdirSync(screenshotDir, { recursive: true });

async function scrollWithHeaderOffset(page, selector) {
  await page.locator(selector).evaluate((element) => {
    const y = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo(0, Math.max(0, y));
  });
}

async function openRecipeHelper(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:8000/mom.html', { waitUntil: 'networkidle' });
  await scrollWithHeaderOffset(page, '.fridge-chef-card');
}

async function fillRecipeHelper(page) {
  await page.locator('#ingredient-input').fill('돼지고기, 라이스페이퍼, 양파');
  await page.getByRole('button', { name: '재료 넣기' }).click();
  await page.locator('#fridge-time').selectOption('15분 안에');
  await page.locator('#fridge-family').selectOption('한-베 가족 저녁');
  await page.locator('#fridge-diet').fill('덜 짜게');
  await page.locator('#fridge-allergy').fill('매운맛 제외');
  await page.getByRole('button', { name: /레시피 만들기/ }).click();
}

test('recipe helper fits mobile and returns practical family output', async ({ page }) => {
  await openRecipeHelper(page, { width: 390, height: 720 });
  await fillRecipeHelper(page);

  await expect(page.locator('#fridge-recipe-result')).toBeVisible();
  await expect(page.locator('#fridge-recipe-title')).toContainText('월남쌈');
  await expect(page.locator('#fridge-shopping-gaps')).toContainText('라임');
  await expect(page.locator('#fridge-family-adjustments')).toContainText('덜 짜게');
  await expect(page.locator('#fridge-safety-note')).toContainText('매운맛 제외');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  const cardBox = await page.locator('.fridge-chef-card').boundingBox();
  expect(cardBox.width).toBeLessThanOrEqual(390);

  await scrollWithHeaderOffset(page, '.fridge-chef-card');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-mobile-390-input.png`),
    fullPage: false
  });
  await scrollWithHeaderOffset(page, '#fridge-recipe-result');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-mobile-390.png`),
    fullPage: false
  });
  await scrollWithHeaderOffset(page, '#fridge-safety-note');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-mobile-390-result-bottom.png`),
    fullPage: false
  });
});

test('recipe helper desktop view and external search link match the promise', async ({ page, context }) => {
  await openRecipeHelper(page, { width: 1366, height: 900 });
  await fillRecipeHelper(page);

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('#result-recipe-btn').click()
  ]);
  await popup.waitForLoadState('domcontentloaded');
  expect(popup.url()).toContain('youtube.com/results?search_query=');
  expect(decodeURIComponent(popup.url())).toContain('돼지고기 라이스페이퍼 월남쌈 레시피');
  await popup.close();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  await scrollWithHeaderOffset(page, '.fridge-chef-card');
  await page.screenshot({
    path: path.join(screenshotDir, `${stamp}-desktop-1366.png`),
    fullPage: false
  });
});
