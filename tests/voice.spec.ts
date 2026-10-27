import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The parts of the site's writing style a machine can check. The rest is for
// a person to judge. A scan of the built HTML's visible text.
const rules: [string, RegExp][] = [
  ['em or en dash', /[—–]/g],
  ['British spelling', /\b(licence[sd]?|colour\w*|favour\w*|behaviour\w*|humour\w*|centre[sd]?|catalogue[sd]?|organis\w*|realis\w*|recognis\w*|generalis\w*|analys(e[sd]?|ing)|programmes?)\b/gi],
  ['a time word that goes stale', /\b(today|yesterday|tomorrow|this week|last week|just now|recently)\b/gi],
];

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

test('the built site follows the checkable style rules', () => {
  const files = htmlFiles('dist');
  expect(files.length).toBeGreaterThan(0);
  const findings: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–');
    for (const [kind, pattern] of rules) {
      for (const match of text.matchAll(pattern)) {
        const at = match.index ?? 0;
        findings.push(`${file}: ${kind}: "${text.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, ' ')}"`);
      }
    }
  }
  expect(findings).toEqual([]);
});
