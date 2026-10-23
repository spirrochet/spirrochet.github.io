import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The publishing rule: nothing leaves that names a host, a work item, an
// account, or a cost. A scan of the built HTML, so it checks what is served.
const allowedKeys = /^(SHA|CVE|ISO|UTF|RFC|GHSA)-/;
const forbidden: [string, RegExp][] = [
  ['work item key', /\b[A-Z]{2,10}-\d{1,5}\b/g],
  ['UUID', /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi],
  ['email address', /[\w.+-]+@[\w-]+\.[\w.]+/g],
  ['dollar amount', /\$\s?\d/g],
  ['credit figure', /\b\d[\d,.]*\s+credits?\b/gi],
];
// Private names, such as machine names, are never written here: this file is
// public. Pass them locally as a regular expression in PORTABILITY_PRIVATE.
if (process.env.PORTABILITY_PRIVATE) {
  forbidden.push(['private name', new RegExp(process.env.PORTABILITY_PRIVATE, 'gi')]);
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

test('the built site passes the portability scan', () => {
  const files = htmlFiles('dist');
  expect(files.length).toBeGreaterThan(0);
  const findings: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    for (const [kind, pattern] of forbidden) {
      for (const match of text.matchAll(pattern)) {
        if (kind === 'work item key' && allowedKeys.test(match[0])) continue;
        findings.push(`${file}: ${kind}: "${match[0]}"`);
      }
    }
  }
  expect(findings).toEqual([]);
});
