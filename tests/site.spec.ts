import { test, expect, type Page } from '@playwright/test';

const SITE = 'https://spirrochet.github.io';

async function crawl(page: Page): Promise<string[]> {
  const seen = new Set<string>();
  const queue = ['/'];
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const response = await page.goto(path);
    expect(response?.status(), `${path} should load`).toBe(200);
    const links = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of links) {
      const url = new URL(href);
      if (url.origin !== new URL(page.url()).origin) continue;
      if (/\.(png|svg|ico|xml|txt)$/.test(url.pathname)) continue;
      if (!seen.has(url.pathname)) queue.push(url.pathname);
    }
  }
  return [...seen].sort();
}

test('every page loads, is described, and switches to a page on the other track', async ({ page }) => {
  const pages = await crawl(page);
  expect(pages.length, 'the crawl should find both tracks').toBeGreaterThanOrEqual(8);

  for (const path of pages) {
    await page.goto(path);
    const track = await page.locator('html').getAttribute('data-track');
    expect(['plain', 'technical'], `${path} declares its track`).toContain(track);

    await expect(page, `${path} has a title`).toHaveTitle(/Christopher James Kites/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0, `${path} has a description`).toBeGreaterThan(20);
    await expect(page.locator('footer'), `${path} states the licenses`).toContainText('All rights reserved');
    const text = await page.locator('body').innerText();
    expect(text, `${path} has no sentence run into the next`).not.toMatch(/[a-z][.?!][A-Z]/);
    const glued = await page.evaluate(() =>
      [...document.querySelectorAll('main a, main code, footer a')].flatMap((el) => {
        const before = el.previousSibling?.textContent ?? '';
        const after = el.nextSibling?.textContent ?? '';
        const found = [];
        if (/[\w.,;:!?]$/.test(before)) found.push(`"${before.slice(-12)}|${el.textContent}"`);
        if (/^\w/.test(after)) found.push(`"${el.textContent}|${after.slice(0, 12)}"`);
        return found;
      }),
    );
    expect(glued, `${path} has no link or code glued to a neighboring word`).toEqual([]);
    await expect(page.locator('head link[rel="license"]'), `${path} declares its license`).toHaveAttribute('href', '/licenses/');

    const toggle = page.locator('a[data-track-switch]');
    await expect(toggle, `${path} has one track switch`).toHaveCount(1);
    const target = await toggle.getAttribute('href');
    const response = await page.goto(target!);
    expect(response?.status(), `${path} switch target ${target} loads`).toBe(200);
    const other = await page.locator('html').getAttribute('data-track');
    expect(other, `${path} switch leads to the other track`).not.toBe(track);
  }
});

test('the home page introduces me and links to both stories', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Christopher James Kites');
  await expect(page.locator('#about')).toContainText('seven years away from regular coding');
  await expect(page.locator('#stories li')).toHaveCount(2);
});

test('an unknown path returns the custom 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Nothing here');
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});

test('a shared link has a title, description, and a 1200 by 630 image', async ({ page, request }) => {
  await page.goto('/case-studies/agent-work-tracking/');
  const meta = (attr: string, key: string) =>
    page.locator(`meta[${attr}="${key}"]`).getAttribute('content');

  expect(await meta('property', 'og:title')).toContain('Agent Work Tracking');
  expect((await meta('property', 'og:description'))?.length).toBeGreaterThan(20);
  expect(await meta('property', 'og:url')).toBe(`${SITE}/case-studies/agent-work-tracking/`);
  expect(await meta('property', 'og:type')).toBe('article');
  expect(await meta('name', 'twitter:card')).toBe('summary_large_image');

  const image = await meta('property', 'og:image');
  expect(image).toBe(`${SITE}/og-default.png`);
  const local = await request.get(new URL(image!).pathname);
  expect(local.status()).toBe(200);
  expect(local.headers()['content-type']).toContain('image/png');

  await page.goto('/og-default.png');
  const size = await page.locator('img').evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]);
  expect(size).toEqual([1200, 630]);
});

test('the favicon is served', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  expect((await request.get(href!)).status()).toBe(200);
});

test('digging deeper and surfacing again', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-track', 'plain');
  await page.screenshot({ path: testInfo.outputPath('1-surface.png'), fullPage: true });

  await page.locator('header').getByRole('link', { name: /dig deeper/i }).click();
  await expect(page).toHaveURL(/\/technical\/$/);
  await expect(page.locator('html')).toHaveAttribute('data-track', 'technical');
  await page.screenshot({ path: testInfo.outputPath('2-deeper.png'), fullPage: true });

  await page.locator('header').getByRole('link', { name: /back to the surface/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('data-track', 'plain');
});

test('a page with no twin on the other track switches to its section there', async ({ page }) => {
  await page.goto('/technical/how-this-site-is-built/');
  await expect(page.locator('a[data-track-switch]')).toHaveAttribute('href', '/#about');
});

test('the timelines list the experiment and the site', async ({ page }) => {
  await page.goto('/journey/');
  expect(await page.locator('ol.timeline > li').count()).toBeGreaterThanOrEqual(10);

  await page.goto('/technical/timeline/');
  expect(await page.locator('#experiment ol.timeline > li').count()).toBeGreaterThanOrEqual(10);
  await expect(page.locator('#site ol.timeline > li').first()).toBeVisible();
});

test('the site timeline leaves out dependency bumps', async ({ page }) => {
  await page.goto('/technical/timeline/');
  const entries = await page.locator('#site ol.timeline > li').allTextContents();
  expect(entries.filter((text) => /bump\b/i.test(text))).toEqual([]);
});

test('the plain track remembers a chosen color theme', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.locator('[data-theme-toggle]');
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(toggle).toContainText('System');
  await expect(html).not.toHaveAttribute('data-theme', /.+/);
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  const light = await background();
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  expect(await background()).not.toBe(light);

  await page.goto('/journey/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-theme-toggle]')).toContainText('Dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

test('stories link to the previous and next story', async ({ page }) => {
  await page.goto('/stories/agent-work-tracking/');
  await expect(page.locator('a[rel="prev"]')).toHaveCount(0);
  await page.locator('a[rel="next"]').click();
  await expect(page).toHaveURL(/\/stories\/when-the-agent-grades-its-own-work\/$/);
  await expect(page.locator('a[rel="next"]')).toHaveCount(0);
  await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', '/stories/agent-work-tracking/');
});

test('the plain footer explains the licenses on the site, not off it', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a')).toHaveAttribute('href', '/licenses/');
  await page.locator('footer a').click();
  await expect(page.locator('h1')).toContainText('What You May Do With This Site');
});
