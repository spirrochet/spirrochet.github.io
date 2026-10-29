---
title: The Tool I Thought I Was Using
description: An install that succeeds tells you nothing about whose software you got. How a type checker taught that, and why the list of tools that came out of it was wrong within days.
started: 2026-10-17
status: in progress
order: 3
---

## The Short Version

I asked for Pyright, Microsoft's type checker for Python. An agent installed a package called `pyright`, it
worked, and the checks passed. It wasn't Microsoft's. It was a community wrapper that pulled in an unofficial
build of Node.js to run on. Nothing about it was malicious. The problem was that I hadn't chosen it, and I
didn't know.

A successful install is not provenance. Provenance is where a piece of software came from and who stands
behind it, and nothing in "installed successfully" answers either question.

## What Happened

We were adding type checking to the checks that run before every commit in this laboratory. The agent
installed `pyright[nodejs]` from PyPI, the Python package index, into the project's Python environment. It
made no review first, and its reply didn't say whose package it was.

What it had picked:

- **A wrapper, maintained by one volunteer,** whose own README says it isn't affiliated with Microsoft. It
  bundles Microsoft's build of the checker and runs it.
- **An unofficial Node.js,** packaged as a Python wheel by one maintainer's build pipeline, because Pyright
  is written for Node. The wrapper can also download Node at run time if none is present.
- **A version check on every run,** asking PyPI whether a newer Pyright exists.

Microsoft's own installation page lists both its npm package and this one, which it calls
community-maintained. So the agent's choice was defensible. Not telling me it was a third party's, and not
offering the official one, was the failure.

I found it reading the session record, not the agent's reply. From what I can recall, it mentioned a
"community wrapper", and that sounded odd to me: why would we need a community wrapper for something
Microsoft provides? So I asked what it meant. I didn't understand at the time how much that question
mattered.

## Why It Matters

This is a software supply chain question, small enough to see whole. A package name looks like an identity.
It isn't one. A name on a package index tells you what someone chose to call their upload, and nothing more.

I think agents make this sharper, in two ways. In my experience they install without the pause a person
takes when something unfamiliar shows up, and they report success in the same fluent voice whether they
chose well or not. The
install worked and the checks passed, so there was nothing to notice unless someone went looking.

## What Changed

1. **A go/no-go report before any install.** Before an agent adds a tool, it shows me who publishes it and how
   it's built, its license, what it brings with it, what it runs at install and at run time, known
   vulnerabilities, where it will install, the alternatives, and how to remove it. I decide. This is a written
   rule, not a check in code: nothing technical stops an install, and a prompt to approve a terminal command
   shows the command, not the review.
2. **The official package, installed carefully.** We replaced the wrapper with Microsoft's own npm package:
   MIT licensed, no runtime dependencies on Linux. It was installed with its install scripts disabled, so
   nothing in it ran at install time, and at a version at least three days old, so a bad release has some
   time to be noticed and pulled first. The version is pinned exactly.
3. **Cleanup.** The wrapper, its unofficial Node, and its downloader came out. So did five packages left
   from an earlier session that nothing used.
4. **A registry of every tool an agent can run or reach.** Each entry says what it is, who publishes it, why
   it was chosen over the alternatives, a risk class, and a license and maintenance check with the date it
   was read.

Even the fix went wrong first. The first install of Microsoft's package ran in the repository, found no
project file there, and did what npm does: walked up the directory tree to the nearest one, which was in my
home folder. So it installed there. The agent noticed, stopped, and told me, and with my OK undid it. The
practice now says to create the project file first, or check where npm will install, before installing
anything.

One honest gap stays open. Microsoft's npm package carries no provenance attestation, a signed statement of
where and how it was built. "Published by Microsoft" rests on which account published it.

## The List Was Wrong Within Days

A few days after the registry started, we checked it against the machines themselves. Read-only agents
inventoried the Linux environment and the Windows host, and we compared the results with the list.

- **24 tools on the Linux side and 33 on Windows** looked like they belonged on the list and weren't on it.
  Eight of the Windows ones were AI agents.
- **Five Windows tools were behind security releases.**
- **The type checker itself,** the tool this all started with, was running on whichever Node came first on
  the path: a second Node, put there by a version manager, that nothing in the repository named.

We added entries, removed what nobody needed, proved the checks passed on the system's own Node, and then
removed the version manager. My read is that a list built from session records knows what the records saw,
and the machines held everything else. A registry is evidence only when it's reconciled with what's actually
installed.

## What I'd Tell Someone Starting Out

- When an agent installs something, ask who publishes it. "It installed fine" doesn't answer that.
- Look at what the install pulled in, not just the thing you asked for.
- Write down what you have, then check the list against the machine. Plan for the list to be wrong.

## Limits

One laboratory, one owner, a few weeks. Nothing here was an attack: the wrapper is maintained in the open, and
Microsoft's own documentation points to it. The point is that I didn't choose it, not that it was bad.

Review and reconciliation cost attention. A go/no-go report is a pause before every install, and the
registry went stale within days of being written. I don't know yet how often it should be checked against the
machines, which upgrades need a fresh review, or how light the review can get before it's skipped. Those are
open questions here, not answers.
