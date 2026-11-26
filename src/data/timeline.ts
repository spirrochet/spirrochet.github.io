export interface Milestone {
  date: string;
  title: string;
  plain: string;
  technical: string;
}

// Curated by hand from the laboratory's session records. Dates are the day the
// session that did the thing began. Nothing here names a host, a work item,
// an account, or a cost.
export const milestones: Milestone[] = [
  {
    date: '2026-09-05',
    title: 'The laboratory starts',
    plain: 'I set up a private notebook that gets an entry every time I work with an AI coding agent.',
    technical:
      'A private repository of Markdown session records with YAML frontmatter, a JSON schema, and a Python validator run before each commit.',
  },
  {
    date: '2026-09-11',
    title: 'A lesson that did not stick becomes a check',
    plain: 'An agent repeated a mistake I had already written a lesson about. So the lesson became a test that runs every time instead.',
    technical:
      'A recorded learning failed to prevent the same false assertion one session later; the validator gained assumption checks, the first of many prose rules turned into code.',
  },
  {
    date: '2026-09-14',
    title: 'Counting what each session costs',
    plain: 'I started tracking what every session costs, including the part the agent cannot see about itself.',
    technical:
      'Per-session cost and context use recorded. The agent’s own closing figure always undercounts by its last response, so the next session corrects it from the harness log.',
  },
  {
    date: '2026-09-19',
    title: 'Every commit is signed by a key I hold',
    plain: 'An agent can prepare changes to my code, but only I can commit them, by touching a hardware key. Agents still act in other places, like my task tracker, which is why the other safeguards here exist.',
    technical:
      'Commit signing and SSH through hardware security keys inside WSL. The agent never runs `git commit`; it emits the command and the owner runs it. This covers version-controlled history only: agents still write to the local machine and, through the owner’s account, to the task tracker.',
  },
  {
    date: '2026-09-26',
    title: 'This site goes live',
    plain: 'The first public page, about this experiment.',
    technical: 'An Astro static site on GitHub Pages, deployed by GitHub Actions on merge to the main branch.',
  },
  {
    date: '2026-09-27',
    title: 'Only a person closes work',
    plain: 'The agent can say it thinks something is finished. Deciding that it is finished is my job.',
    technical:
      'Work item lifecycle semantics: the doer moves work to review with evidence per acceptance criterion, and only the owner moves it to done.',
  },
  {
    date: '2026-09-30',
    title: 'A plan for when things go wrong',
    plain: 'I wrote down what happens if an agent does something it should not: stop, tell me, then fix it.',
    technical:
      'An incident protocol covering credential exposure, writes outside scope, and unapproved irreversible changes: stop, report, assess, contain, verify.',
  },
  {
    date: '2026-10-02',
    title: 'The first monthly review',
    plain: 'A month in, I stepped back and asked what was working and what was just ceremony.',
    technical:
      'A scheduled review against a fixed question list, closing out cost-modelling series and setting tool-approval gates.',
  },
  {
    date: '2026-10-09',
    title: 'Checking my practices against the field',
    plain: 'Several agents researched what others recommend, and I checked their claims before believing any of them.',
    technical:
      'A field review: research reports from several agents, each claim verified against a primary source before it could change a practice.',
  },
  {
    date: '2026-10-11',
    title: 'Parallel lines of work, with fences',
    plain: 'The work split into separate threads, each only allowed to touch its own things.',
    technical:
      'Workstream files hold each line of work’s state and its write scope; the validator fails a branch that writes outside it.',
  },
  {
    date: '2026-10-18',
    title: 'No new tool without a review',
    plain: 'Before an agent installs anything, it has to show me what it is, who makes it, and how to remove it.',
    technical:
      'A go/no-go report for every dependency, a three-day cooldown on new releases, and exact pins, before any install.',
  },
  {
    date: '2026-10-19',
    title: 'An inventory of everything an agent can reach',
    plain: 'A list of every tool on my machines an agent could use, and why each one is there.',
    technical:
      'A tool registry: each entry with its first use, the alternatives weighed, a risk class, and a license and maintenance check read on a stated date.',
  },
  {
    date: '2026-10-21',
    title: 'The inventory checked against the machines',
    plain: 'We compared the list of tools with what was really installed. Dozens were missing from it, and a few were behind on security updates.',
    technical:
      'Read-only agents inventoried the Linux environment and the Windows host; the diff against the registry found 57 likely entries missing and five tools behind security releases. A registry is evidence only when reconciled.',
  },
  {
    date: '2026-10-23',
    title: 'Ten principles for checkable agent work',
    plain: 'A short guide for building work so that what the agent did can be checked by something other than the agent.',
    technical:
      'A draft guideline of ten principles, from confidence is not evidence to closing the loop on failures, each mapped to the check that carries it.',
  },
  {
    date: '2026-10-23',
    title: 'This site gets tests and a container',
    plain: 'The site is now checked the way a visitor sees it, every time it changes.',
    technical:
      'Playwright tests of every page and its track switch, a portability scan of the built output, a dev container, and actions pinned by commit.',
  },
  {
    date: '2026-10-30',
    title: 'A different agent tool, the same notebook',
    plain: 'I moved my daily work to a different AI coding tool. Before relying on it, we tested where it keeps its logs, what it asks permission for, and how its cost is counted. The notebook and its rules came along.',
    technical:
      'A harness test before the switch: where the new harness keeps a chat’s transcript, how its tokens become a cost estimate, and which rules it enforces. The session records, the checks, and the rules carried over; the scripts that read a harness’s own logs were extended to read the new one, and what differs by harness moved into one file per harness.',
  },
  {
    date: '2026-11-01',
    title: 'A written rule is a request',
    plain: 'The second monthly review counted which mistakes came back. Rules that only existed in writing kept being broken. The ones a tool enforces weren’t broken again that month.',
    technical:
      'The second monthly review, the first across two harnesses, with 27 findings. Exceptions recurred where the prevention was a prose rule, and stopped where it became a rule the harness enforces. A rule that has to hold every time now names the check or gate that enforces it; one that names none is treated as an assertion.',
  },
  {
    date: '2026-11-13',
    title: 'A limit on how much is open at once',
    plain: 'Ideas were piling up faster than work got finished. We sorted every open item, and I set a limit on how many can be in progress at once. Before an item starts, an agent that didn’t write it checks that it’s ready to start.',
    technical:
      'The laboratory’s 132 open work items, triaged by four read-only agents that each read a quarter of them whole. Priority became a class of service, each line of work got limits on work in progress, every waiting status now ages, and a readiness check with two gates stands between the backlog and a start. The limits are guidelines on trial, not gates.',
  },
  {
    date: '2026-11-14',
    title: 'Each line of work corrects only its own records',
    plain: 'When one thread of work finds a mistake in another thread’s notes, it sends a message instead of fixing it. The thread that wrote the note makes the correction.',
    technical:
      'Write boundaries between workstreams: a session record, and the files that belong to it, are corrected only by its own workstream. A finding for another workstream goes as a message, and work for another is filed as a proposal that its target accepts, redirects, or recommends declining. The validator fails a branch that changes another workstream’s record.',
  },
  {
    date: '2026-11-15',
    title: 'One list of what the agent may reach',
    plain: 'Everything the agent is allowed to reach is written in one list, with a reason for each entry. Its commands run in a sandbox, and it can’t edit the settings that grant its own permissions. That narrows what a mistake can touch. It doesn’t make a mistake impossible.',
    technical:
      'Least privilege across harnesses: one registry of grants, each with its reason, checked against the harness’s settings in both directions. Shell commands run sandboxed, the file tools refuse writes outside the working directories, and only I can change the settings files. The rules that refuse a command match its text, so they are not a boundary around the program it runs; the practice says so.',
  },
  {
    date: '2026-11-20',
    title: 'Nothing written gets changed',
    plain: 'The agent proposed a new shape for the notebook. I answered with a different one, and after testing it, the agent recommended mine: each conversation writes its own entry, by command, and nothing is edited afterward. A correction is a new entry that names what it corrects. It isn’t built yet; a trial comes first.',
    technical:
      'A decision on the record’s shape: one append-only record per chat, written only by command, with a session’s state derived from the chats that claim it. The design was made twice, the second time by an agent that was not shown the first, and its core ran in a small model before the proposal was accepted. The build is planned as a trial.',
  },
];
