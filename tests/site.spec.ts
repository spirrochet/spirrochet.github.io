import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const SITE = 'https://spirrochet.github.io';
const AGENT_WORDING = 'Written with an AI agent; every claim reviewed by me';

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

    // Who wrote the page: one line in the footer, above the license lines.
    const authorship = page.locator('footer > p[data-authorship]');
    await expect(authorship, `${path} says who wrote it, once`).toHaveCount(1);
    const prose = await authorship.getAttribute('data-authorship');
    expect(await page.locator('html').getAttribute('data-prose'), `${path} marks its prose the same way`).toBe(prose);
    if (prose === 'agent') {
      await expect(authorship.locator('a'), `${path} carries the agreed wording`).toHaveText(AGENT_WORDING);
    } else {
      expect(prose, `${path} is marked as an agent's draft or as my own words`).toBe('own');
      await expect(authorship, `${path} is marked as my own words`).toContainText('in my own words');
    }
    await expect(authorship.locator('a'), `${path} links to the authorship page`).toHaveAttribute('href', '/authorship/');
    await expect(authorship, `${path} keeps authorship off the license line`).not.toContainText(/license|rights reserved/i);
    await expect(page.locator('footer > p').first(), `${path} puts authorship first in the footer`).toHaveAttribute('data-authorship', /.+/);
    await expect(page.locator('footer > p').nth(1), `${path} puts the license line next`).toContainText('All rights reserved');
    const unlabeled = await page.locator('blockquote.own-words:not(:has(.own-words-label))').count();
    expect(unlabeled, `${path} labels every passage in my own words`).toBe(0);
    // The spotlight's button shows only where the page has words of mine, and it is off unless asked for.
    const mine = prose === 'own' || (await page.locator('blockquote.own-words').count()) > 0;
    const spotlight = page.locator('[data-spotlight-toggle]');
    await expect(spotlight, `${path} has one spotlight button`).toHaveCount(1);
    if (mine) await expect(spotlight, `${path} offers the spotlight`).toBeVisible();
    else await expect(spotlight, `${path} hides the spotlight, having none of my words`).toBeHidden();
    await expect(page.locator('html'), `${path} loads with the spotlight off`).not.toHaveAttribute('data-spotlight', 'on');

    const toggle = page.locator('a[data-track-switch]');
    await expect(toggle, `${path} has one track switch`).toHaveCount(1);
    const target = await toggle.getAttribute('href');
    const response = await page.goto(target!);
    expect(response?.status(), `${path} switch target ${target} loads`).toBe(200);
    const other = await page.locator('html').getAttribute('data-track');
    expect(other, `${path} switch leads to the other track`).not.toBe(track);
  }
});

test('the home page introduces me and links to every story', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Christopher James Kites');
  await expect(page.locator('#about')).toContainText('seven years away from regular coding');
  await expect(page.locator('#stories li')).toHaveCount(4);
});

test('the technical index lists every case study', async ({ page }) => {
  await page.goto('/technical/');
  await expect(page.locator('#case-studies li')).toHaveCount(4);
});

test('a case study says when it was last updated, from its file, and prints no status', async ({ page }) => {
  await page.goto('/technical/');
  const links = await page.locator('#case-studies li a').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')!));
  expect(links.length).toBeGreaterThanOrEqual(4);
  for (const href of links) {
    await page.goto(href);
    const eyebrow = page.locator('article .eyebrow');
    await expect(eyebrow, `${href} prints no status`).not.toContainText(/in progress|complete/i);
    await expect(eyebrow, `${href} says when it was last updated`).toContainText('last updated');
    const file = `src/content/case-studies/${href.split('/').filter(Boolean).pop()}.md`;
    const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim();
    const expected = committed || statSync(file).mtime.toISOString().slice(0, 10);
    await expect(eyebrow.locator('time'), `${href} shows its file's newest date`).toHaveAttribute('datetime', expected);
  }
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
  await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', '/stories/agent-work-tracking/');
  await page.locator('a[rel="next"]').click();
  await expect(page).toHaveURL(/\/stories\/what-did-the-agent-just-install\/$/);
  await page.locator('a[rel="next"]').click();
  await expect(page).toHaveURL(/\/stories\/when-the-agent-printed-a-secret\/$/);
  await expect(page.locator('a[rel="next"]')).toHaveCount(0);
});

test('the plain footer explains the licenses on the site, not off it', async ({ page }) => {
  await page.goto('/');
  const licenses = page.locator('footer a[href="/licenses/"]');
  await expect(licenses).toHaveCount(1);
  await licenses.click();
  await expect(page.locator('h1')).toContainText('What You May Do With This Site');
});

test('the authorship page is reachable from the footer and marks my own words', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: AGENT_WORDING }).click();
  await expect(page).toHaveURL(/\/authorship\/$/);
  await expect(page.locator('h1')).toContainText('Who Wrote What');
  expect(await page.locator('blockquote.own-words').count()).toBeGreaterThanOrEqual(1);
  await expect(page.locator('a[data-track-switch]')).toHaveAttribute('href', '/technical/how-this-site-is-built/#authorship');
});

// WCAG 2 contrast ratio between two CSS colors, as the browser computed them.
const contrast = (a: string, b: string) => {
  const luminance = (color: string) => {
    const [r, g, bl] = color.match(/[\d.]+/g)!.slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('the spotlight button brings my words forward, remembers the choice, and turns off again', async ({ page }) => {
  await page.goto('/authorship/');
  const html = page.locator('html');
  const button = page.locator('[data-spotlight-toggle]');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(html).toHaveAttribute('data-spotlight', 'on');
  await expect(button).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/case-studies/the-token-in-the-chat/');
  await expect(page.locator('html'), 'the choice carries to another page with my words').toHaveAttribute('data-spotlight', 'on');
  await page.goto('/');
  await expect(page.locator('html'), 'a page with none of my words is never dimmed').not.toHaveAttribute('data-spotlight', 'on');
  await expect(page.locator('[data-spotlight-toggle]')).toBeHidden();

  await page.goto('/authorship/');
  await page.locator('[data-spotlight-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-spotlight', 'off');
  await expect(page.locator('[data-spotlight-toggle]')).toHaveAttribute('aria-pressed', 'false');
});

// The spotlight's styles apply when the root element carries data-spotlight.
// The tests below set that attribute by hand, to read colors and motion.
for (const scheme of ['light', 'dark'] as const) {
  test(`with the spotlight on, dimmed text keeps its contrast and my words keep theirs (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/authorship/');
    const read = () =>
      page.evaluate(() => {
        const color = (el: Element | null) => getComputedStyle(el!).color;
        return {
          background: getComputedStyle(document.body).backgroundColor,
          rest: color(document.querySelector('main > p')),
          link: color(document.querySelector('main a') ?? document.querySelector('main > p')),
          mine: color(document.querySelector('blockquote.own-words p:not(.own-words-label)')),
          mineBackground: getComputedStyle(document.querySelector('blockquote.own-words')!).backgroundColor,
        };
      });
    const before = await read();
    await page.evaluate(() => (document.documentElement.dataset.spotlight = 'on'));
    const after = await read();
    expect(after.rest, 'the rest steps back').not.toBe(before.rest);
    expect(after.mine, 'my words stay at full strength').toBe(before.mine);
    expect(contrast(after.rest, after.background), 'dimmed text').toBeGreaterThanOrEqual(4.5);
    expect(contrast(after.link, after.background), 'dimmed link').toBeGreaterThanOrEqual(4.5);
    expect(contrast(after.mine, after.mineBackground), 'my words').toBeGreaterThanOrEqual(4.5);
  });
}

test('with the spotlight on, dimmed text keeps its contrast on the technical track', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/technical/');
  await page.evaluate(() => (document.documentElement.dataset.spotlight = 'on'));
  const colors = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    rest: getComputedStyle(document.querySelector('main p.lede')!).color,
    link: getComputedStyle(document.querySelector('main a')!).color,
  }));
  expect(contrast(colors.rest, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(colors.link, colors.background)).toBeGreaterThanOrEqual(4.5);
});

test('the spotlight moves my words only for a reader who has not asked for reduced motion', async ({ page }) => {
  const motion = () =>
    page.evaluate(() => {
      const mine = getComputedStyle(document.querySelector('blockquote.own-words')!);
      return { transform: mine.transform, duration: mine.transitionDuration, main: getComputedStyle(document.querySelector('main')!).transitionDuration };
    });
  const durations = (value: string) => value.split(',').map((part) => parseFloat(part));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/authorship/');
  await page.evaluate(() => (document.documentElement.dataset.spotlight = 'on'));
  const reduced = await motion();
  expect(reduced.transform, 'no rise').toBe('none');
  expect(Math.max(...durations(reduced.duration), ...durations(reduced.main)), 'no transition').toBe(0);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/authorship/');
  await page.evaluate(() => (document.documentElement.dataset.spotlight = 'on'));
  await expect.poll(async () => (await motion()).transform, { message: 'my words rise' }).not.toBe('none');
  expect(Math.max(...durations((await motion()).duration))).toBeGreaterThan(0);
});
