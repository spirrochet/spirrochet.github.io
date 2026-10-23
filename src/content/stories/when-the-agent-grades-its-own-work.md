---
title: Who Says It's Done?
description: An AI agent will happily tell you it's finished. Here's what I found when I checked, and what I changed.
caseStudy: when-the-agent-grades-its-own-work
order: 2
---

Here's something I didn't expect. The AI agents I work with are great at saying "done". They're less
great at being done.

For the first few weeks I let the agent mark its own work as finished in my task tracker. It seemed
efficient. Then one day I re-read a task it had closed, and it wasn't actually finished. So I went back
and checked all of them.

Of eighteen tasks an agent had closed, about half were genuinely fine. The rest had something missing, a
few had no definition of "finished" at all, and four were closed within thirteen seconds of each other,
which isn't enough time to have checked anything.

The work wasn't bad, exactly. The problem was that I couldn't tell the good half from the bad half
without doing all the checking again myself.

What changed:

- The agent can say it thinks something is finished, and show me why. Only I mark it done.
- A second agent, one that didn't do the work, spot-checks the claims.
- Where I could, I swapped rules for automatic checks. A rule the agent is asked to follow gets skipped
  eventually. A check that fails the build doesn't.

The part I like: just today, one of those automatic checks stopped my agent from editing something it
shouldn't have. It was confident, it had a reasonable-sounding reason, and the check said no anyway.
Nobody had to notice. That's the point.

I'm not sure yet how far this goes. In time I'd like to trust the agent with more, but I want that trust
to come from evidence, not from how sure it sounds.
