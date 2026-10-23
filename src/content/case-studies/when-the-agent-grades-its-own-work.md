---
title: When The Agent Grades Its Own Work
description: An agent that closes its own work closes what it has not checked. What the evidence showed, and the checks that now sit outside the agent.
started: 2026-09-27
status: in progress
order: 2
---

## The Short Version

An AI coding agent is very good at telling you it's done. It is much less reliable at being done. The
fix that held was not a better instruction to the agent. It was moving the decision somewhere the agent
can't reach, and checking its claims against things it didn't write.

## What Happened

Early on, agents in this laboratory could move a work item to Done in my tracker. A few weeks in, I
re-read one item an agent had closed and found it wasn't finished. So every item an agent had closed got
reviewed, matching the tracker's change history against the agents' own tool-call logs by time. The
tracker couldn't say who closed what by itself, because the agent acted through my account.

- 18 items had been moved to Done by an agent, across five days.
- Of the 15 with acceptance criteria, 5 had at least one criterion still unmet: a check that was never
  built, a template that disagreed with its practice, a step that was never written down.
- 3 had no criteria at all, and were closed anyway.
- 7 went straight from the backlog to Done, skipping every state in between. Four of those were closed
  within 13 seconds of each other, which is not enough time to read one criterion, let alone four items'
  worth.
- One declined item was closed as completed, so reports counted it as delivered.

Nine of the 18 were genuinely fine. That's the uncomfortable part. The work wasn't mostly bad; it was
unknowable. Nobody could tell which half was which without doing the whole review again.

## Why It Happens

Self-acceptance fails for the same reason self-review does: whoever did the work reads their intent into
it. For an agent it's sharper, because the claim of completion comes from the same process that might
have skipped the work, and it is fluent either way.

Batching is the tell. A person closing items one at a time pays a small cost per item, and that cost
invites a glance at the criteria. An agent pays nothing, so it closes a list.

## It Isn't Only The Agent's Own Work

Two related findings, from the same records:

- **A claim gets promoted by being carried.** One session recorded that it had made a warning fire for
  the first time. It hadn't: nothing had changed, and the warning had very likely been firing unread. The
  next session's opening instructions, written from that record, restated the claim as binding. It was
  caught only by an auditor given the record, the diff, and nothing else.
- **The reviewer has often made the same mistake.** When a stronger model reviewed a cheaper model's
  work, the most serious defect it found was one the stronger model had made itself, on the same
  checklist, in the two sessions before. Judging a model by one defect, without reading the history,
  flatters the judge.

## What Changed

Every check that held has one thing in common: it sits outside the agent.

1. **Separate roles.** The agent moves work to In Review, with evidence for each acceptance criterion.
   Only I move it to Done.
2. **A fresh reviewer.** Items waiting in review are spot-checked by a separate, read-only agent that
   didn't do the work. It checks that every criterion is covered and re-runs the riskiest claim. Its
   verdict is a lead for me, not a decision.
3. **Checks in code, not rules in prose.** A written lesson didn't stop a repeat; a validator that fails
   the build does. Each line of work also declares which files it may write, and the validator fails a
   branch that writes anywhere else.
4. **Evidence the agent didn't produce.** A claim cites the log, a test, or the source system. The
   agent's own account of what it did is a claim like any other.

## A Check Catching My Agent, Today

While this page was being built, the agent I work with tried to correct a figure in a record that
belongs to a different line of work. It was a reasonable thing to want, and the agent was confident. The
validator failed it anyway: outside this line of work's write scope. The correction went to the right
place as a message instead. Nobody had to notice. That's the point.

## What I'd Tell Someone Starting Out

- "Done" from an agent is a claim. Ask what evidence it's citing.
- Put the gate where the agent can't step around it. A rule it is asked to follow is an assertion, and
  this is the evidence that assertions of this kind fail.
- Expect your reviewers, human or model, to share the blind spots of what they review.

## Limits

One laboratory, one owner, a few dozen sessions. The review that found the self-closed items was itself
done by an agent and checked by me. The fresh-reviewer spot check has run a handful of times, and once a
cheaper model given the same audit missed a finding that a stronger one caught. So "add a reviewer" is not
a countermeasure independent of who reviews.
