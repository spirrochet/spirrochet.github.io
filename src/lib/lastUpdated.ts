import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

// When a file last changed, as a date: the newest commit that touched it,
// read from git at build time. A file not yet committed has no commit, so it
// falls back to the file's own modification date; with neither, undefined,
// and the page says nothing rather than failing the build.
export function lastUpdated(path: string): string | undefined {
  try {
    const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', path], { encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(committed)) return committed;
  } catch {
    // No git, or no history: fall through to the file's own date.
  }
  try {
    return statSync(path).mtime.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}
