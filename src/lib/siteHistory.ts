import { execFileSync } from 'node:child_process';

export interface SiteEvent {
  date: string;
  title: string;
}

// The site's own history, read from git at build time: the repository's first
// commit, then every pull request merged into the main line, by its title.
// A merge is found by its two parents, not by its message, so the timeline
// survives a change to the repository's merge-message setting.
// A shallow or missing history yields what it can, never a failed build.
export function siteHistory(): SiteEvent[] {
  try {
    const out = execFileSync('git', ['log', '--first-parent', '--reverse', '--format=%cs%x1f%P%x1f%s%x1f%b%x1e'], {
      encoding: 'utf8',
    });
    const records = out
      .split('\x1e')
      .map((record) => record.trim())
      .filter(Boolean)
      .map((record) => record.split('\x1f'));
    return records.flatMap(([date, parents, subject, body = ''], index) => {
      if (index === 0) return [{ date, title: 'Repository created' }];
      if (parents.trim().split(/\s+/).length < 2) return [];
      const raw = subject.startsWith('Merge pull request') ? body.split('\n')[0] || subject : subject;
      const title = raw.replace(/\s+\(#\d+\)$/, '').replace(/^[a-z]+(\([^)]*\))?!?:\s*/, '');
      return [{ date, title: title.charAt(0).toUpperCase() + title.slice(1) }];
    });
  } catch {
    return [];
  }
}
