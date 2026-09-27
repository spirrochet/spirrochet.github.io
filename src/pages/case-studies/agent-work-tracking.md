---
layout: ../../layouts/Base.astro
title: Agent Work Tracking
description: A laboratory that records every session with an AI coding agent, to learn from evidence what works.
---

# Agent Work Tracking

*A case study in progress. Started September 2026.*

## What It Is

Agent Work Tracking is a private, six-month laboratory. Every time I work
with an AI coding agent, the session produces a record: what the goal was,
what was done, what it cost, what went wrong, and what went right. The
records are evidence, not policy. The point is to design my future tooling
for agents from what actually happened, rather than from what I expected.

It is deliberately small: plain Markdown files with structured frontmatter,
a schema, and a validator that is run before each session's work is
committed. Nothing is automated until enough records exist to show it is
worth automating.

## Why Record Every Session

A study that records only the memorable sessions measures what its author
found memorable. The sessions that stand out are the ones that went very
badly or unusually well, so a corpus of them supports strong claims in both
directions and honest claims in neither.

So every session is recorded, including the short and boring ones. Boring
records are the only evidence for the question that matters most: how much
of the cost of working with an agent is routine overhead, and how much is
the occasional incident.

## What The Evidence Has Shown So Far

### A Written Lesson Does Not Prevent The Repeat

An agent recorded a lesson about a tool response that silently omits a
field. In the very next session, the same agent read the same system
through the same view, saw no field, and confidently reported a structural
fact that was false. The lesson was accurate, specific, reviewed, and
committed. It changed nothing.

The distinction that matters is not written versus unwritten. It is
**passive versus executing**. A passive record degrades silently; a check
that runs fails loudly. A lesson is now only considered finished when it
has become one of three things: an automated check, a step read at a
forced moment such as session start, or a structural change that makes the
failure impossible.

### A Missing Field Is Not An Empty Field

That lesson was itself about absence. An API response looks exhaustive: a
JSON object presents as a complete description of a thing, and there is no
visual difference between a field that is empty and a field that was never
in scope. Having asked for a field feels like having earned an answer about
it. The countermeasure is to ask the question directly, and to treat "no
rows have this field" as a signal about the query, not the data.

### A Checklist Is Satisfied By Its Cheapest Reading

A closeout step required "one command sequence" for handing work back.
The agent produced one, and omitted four other artifacts the handover
needed, which then had to be rebuilt by hand. Nothing was violated. A
checklist item that names an artifact without listing its contents will be
satisfied by the cheapest thing that matches the name. The fix is to
enumerate contents, not shape, and to record next to each item the failure
that put it there, so it is not trimmed later.

### Two Models Fitted, Two Models Broken

The cost an agent reports at the end of a session always undercounts,
because its own closing response is not yet in the figure. I tried to model
the gap. The first model, proportional, was fitted to two points and broken
by the third. The second, a fixed amount, was fitted to four points, stated
with more confidence, and broken by the next two in opposite directions.
The better explanation is that the gap tracks how full the agent's context
is when it closes, not how long the session ran.

The finding I keep is less about cost than about method: two points always
define a line, and the second model was believed more firmly than the first
because it came with an explanation.

### The Test For What May Leave

This page exists under a rule the laboratory already uses: a finding may
leave only if it is still true and useful with every proper noun removed.
Rewriting a finding that way usually improves it, because the
generalisation that survives is the part worth saying. Session records
never pass it, since their job is to name the specifics, so this page is
written fresh from the findings rather than copied from the records.

## What Comes Next

This is the first page. The laboratory runs until early 2027, with a
monthly review of what the evidence says. Future entries will cover how the
controls evolved, where the agent was trusted with more, and where that
trust was pulled back.
