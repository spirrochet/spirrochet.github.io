// Renders the default social preview image from scripts/og-card.html.
// Run after changing the card: npm run og
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('./og-card.html', import.meta.url), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: 'public/og-default.png' });
await browser.close();
console.log('wrote public/og-default.png');
