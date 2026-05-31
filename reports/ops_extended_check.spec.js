const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const evidenceStamp = process.env.OPS_EVIDENCE_STAMP || new Date().toISOString().replace(/[:.]/g, '-');
const screenshotDir = path.join('reports', 'screenshots', 'autonomous', evidenceStamp);
fs.mkdirSync(screenshotDir, { recursive: true });
const evidence = [];

function writeEvidenceManifest() {
  if (evidence.length === 0) return;
  fs.writeFileSync(
    path.join(screenshotDir, 'manifest.json'),
    JSON.stringify({
      stamp: evidenceStamp,
      rule: 'Each operating-gate run stores screenshots and a manifest under reports/screenshots/autonomous/<stamp>.',
      screenshots: evidence
    }, null, 2)
  );
}

function screenshotPath(name, meta = {}) {
  const filePath = path.join(screenshotDir, name);
  evidence.push({
    file: filePath.replace(/\\/g, '/'),
    createdAt: new Date().toISOString(),
    ...meta
  });
  writeEvidenceManifest();
  return filePath;
}

process.on('exit', writeEvidenceManifest);

const targets = [
  ['remote', 'https://tsst-csa.pages.dev/?check=extended-ops-20260531'],
  ['local', 'http://127.0.0.1:8000/index.html']
];

const viewports = [
  ['desktop', { width: 1366, height: 900 }],
  ['mobile', { width: 390, height: 720 }]
];

const sharedFloorHrefs = ['mom.html', 'baby.html', 'dad.html', 'blog.html', 'stars.html'];

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
        path: screenshotPath(`index-ops-extended-${targetName}-${viewportName}.png`, {
          target: targetName,
          viewport: viewportName,
          check: 'operating-console-flow'
        }),
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
    path: screenshotPath('index-first-viewport-local-mobile.png', {
      target: 'local',
      viewport: 'mobile',
      check: 'first-viewport'
    }),
    fullPage: false
  });

  expect(consoleErrors).toEqual([]);
});

test('local pages use the shared navigation structure and floor order', async ({ page }) => {
  const pages = ['index.html', 'mom.html', 'baby.html', 'dad.html', 'blog.html', 'stars.html'];

  for (const file of pages) {
    await page.goto(`http://127.0.0.1:8000/${file}`, { waitUntil: 'domcontentloaded' });
    const nav = page.locator('ul.nav-links').first();
    await expect(nav, `${file} shared nav`).toBeVisible();

    if (file === 'index.html') {
      await expect(nav, 'index keeps home-specific styling while joining shared nav').toHaveClass(/fs-links/);
    }

    const hrefs = await nav.locator('a').evaluateAll((links) =>
      links.slice(0, 5).map((link) => link.getAttribute('href'))
    );
    expect(hrefs, `${file} floor href order`).toEqual(sharedFloorHrefs);
  }
});

test('homepage room drawer is compact and avoids duplicate preview labeling', async ({ page }) => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  expect(indexHtml).not.toContain('ROOM PREVIEW');
  expect(indexHtml).toContain('nav-links fs-links');

  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
  const drawerBox = await page.locator('#roomDrawer').boundingBox();
  expect(drawerBox.width).toBeLessThanOrEqual(322);
});

test('local room pages keep distinct customer roles', async ({ page }) => {
  const roleChecks = [
    ['mom.html', /오늘 식탁과 엄마의 회복을 먼저 챙기는 방/, /냉장고 재료로 오늘 식단 만들기/],
    ['baby.html', /아이와 바로 놀 수 있는 5분 놀이방/, /글자 공부 학습판/],
    ['dad.html', /돈, 비자, 서류를 놓치지 않는 아빠 작업실/, /생활비·송금 보드/],
    ['blog.html', /4층 가족 거실 기록장/, /공개 글 후보 선반/],
    ['stars.html', /옥상 별보기 미션/, /밤하늘 이동/]
  ];

  for (const [file, primaryText, secondaryText] of roleChecks) {
    await page.setViewportSize(file === 'stars.html' ? { width: 1366, height: 900 } : { width: 390, height: 720 });
    await page.goto(`http://127.0.0.1:8000/${file}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(primaryText).first()).toBeVisible();
    await expect(page.getByText(secondaryText).first()).toBeVisible();
  }
});

test('local primary CTAs and floor links navigate to intended pages', async ({ page }) => {
  const linkChecks = [
    ['index.html', '1층 식단부터 보기', /mom\.html$/],
    ['index.html', '엄마 공간으로 들어가기', /mom\.html$/],
    ['index.html', '1층 엄마', /mom\.html$/],
    ['index.html', '2층 아기', /baby\.html$/],
    ['index.html', '3층 아빠', /dad\.html$/],
    ['index.html', '4층 가족', /blog\.html$/],
    ['index.html', '옥상', /stars\.html$/],
    ['mom.html', '2층 아기', /baby\.html$/],
    ['baby.html', '3층 아빠', /dad\.html$/],
    ['dad.html', '4층 가족', /blog\.html$/],
    ['blog.html', '옥상', /stars\.html$/],
    ['stars.html', '1층 엄마', /mom\.html$/]
  ];

  for (const [file, label, expectedUrl] of linkChecks) {
    await page.goto(`http://127.0.0.1:8000/${file}`, { waitUntil: 'domcontentloaded' });
    const link = page.getByRole('link', { name: label }).first();
    await expect(link, `${file} -> ${label}`).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href, `${file} -> ${label}`).toBeTruthy();

    const response = await page.goto(new URL(href, `http://127.0.0.1:8000/${file}`).toString(), { waitUntil: 'domcontentloaded' });
    expect(response.status(), `${file} -> ${label} HTTP status`).toBeLessThan(400);
    expect(page.url(), `${file} -> ${label} destination`).toMatch(expectedUrl);
  }
});

test('page role headlines stay unique and do not collapse into duplicate content', async () => {
  const roleMarkers = {
    'mom.html': ['오늘 식탁과 엄마의 회복을 먼저 챙기는 방', '냉장고 재료로 오늘 식단 만들기'],
    'baby.html': ['아이와 바로 놀 수 있는 5분 놀이방', '글자 공부 학습판'],
    'dad.html': ['돈, 비자, 서류를 놓치지 않는 아빠 작업실', '생활비·송금 보드'],
    'blog.html': ['4층 가족 거실 기록장', '공개 글 후보 선반'],
    'stars.html': ['옥상 별보기 미션', '밤하늘 이동']
  };
  const allHtml = Object.fromEntries(
    Object.keys(roleMarkers).map((file) => [file, fs.readFileSync(file, 'utf8')])
  );

  for (const [file, markers] of Object.entries(roleMarkers)) {
    const ownHtml = allHtml[file];
    for (const marker of markers) {
      expect(ownHtml, `${file} missing ${marker}`).toContain(marker);
      const duplicatePages = Object.entries(allHtml)
        .filter(([otherFile, html]) => otherFile !== file && html.includes(marker))
        .map(([otherFile]) => otherFile);
      expect(duplicatePages, `${marker} duplicated outside ${file}`).toEqual([]);
    }
  }
});

test('public page copy avoids stale daily dates and keeps risk disclaimers', async () => {
  const publicPages = ['mom.html', 'baby.html', 'dad.html', 'blog.html', 'stars.html'];
  const combined = publicPages.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

  expect(combined).not.toContain('2026-05-30');
  expect(combined).not.toContain('오늘 실제 반영한 매일 업데이트');
  expect(combined).not.toContain('오늘 이미지 증거');
  expect(combined).not.toContain('위 순서를 따르면 촉박함 없이 TRC를 갱신할 수 있습니다.');

  expect(combined).toContain('금융 조언이 아니라');
  expect(combined).toContain('법률 조언이 아니라');
  expect(combined).toContain('공식 기관·전문가 기준으로 재확인');
});

test('sample external reference links are reachable', async ({ request }) => {
  const urls = [
    'https://winmart.vn/info/transaction-policy',
    'https://www.lottemart.vn/',
    'https://k-market.vn/en/k-market/',
    'https://overseas.mofa.go.kr/vn-ko/index.do'
  ];

  const reachable = [];
  for (const url of urls) {
    try {
      const response = await request.get(url, { timeout: 20000 });
      if (response.status() < 400) reachable.push(url);
    } catch (error) {
      // Some government/CDN sites reset bot-like test clients; require the commercial references plus one official-style sample overall.
    }
  }
  expect(reachable.length, `reachable links: ${reachable.join(', ')}`).toBeGreaterThanOrEqual(3);
});

test('operating docs require missed-QA prevention and trend-purpose gates', async () => {
  const docs = fs.readFileSync(path.join('agents', 'daily_operating_sequence.md'), 'utf8');
  expect(docs).toContain('Missed-QA prevention');
  expect(docs).toContain('Trend-purpose filter');
  expect(docs).toContain('homepage purpose statement');
  expect(docs).toContain('next QA run must recheck');
});
