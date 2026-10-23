import { execFileSync } from 'node:child_process';

export interface SiteEvent {
  date: string;
  title: string;
}

// The site's own history, read from git at build time: the repository's first
// commit, then every pull request merged into the main line, by its title.
// A shallow or missing history yields what it can, never a failed build.
export function siteHistory(): SiteEvent[] {
  try {
    const out = execFileSync('git', ['log', '--first-parent', '--reverse', '--format=%cs%x1f%s%x1f%b%x1e'], {
      encoding: 'utf8',
    });
    return out
      .split('\x1e')
      .map((record) => record.trim())
      .filter(Boolean)
      .map((record) => {
        const [date, subject, body] = record.split('\x1f');
        const merged = subject.startsWith('Merge pull request');
        const raw = merged ? (body.split('\n')[0] || subject) : subject;
        const title = raw.replace(/^[a-z]+(\([^)]*\))?!?:\s*/, '');
        return { date, title: title.charAt(0).toUpperCase() + title.slice(1), merged, initial: subject === 'Initial commit' };
      })
      .filter((event) => event.merged || event.initial)
      .map(({ date, title, initial }) => ({ date, title: initial ? 'Repository created' : title }));
  } catch {
    return [];
  }
}
