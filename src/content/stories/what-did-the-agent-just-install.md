---
title: What Did The Agent Just Install?
description: I asked an AI agent for one tool and got a different one with the same name. What I learned about checking where software comes from.
caseStudy: the-tool-i-thought-i-was-using
order: 3
---

I asked for a tool called Pyright. An agent installed something called pyright. They weren't the same
thing.

Pyright is a free tool from Microsoft that checks code for a certain kind of mistake. What the agent
installed was a version repackaged by a volunteer, plus a copy of another program it needed, built by
someone else again. It worked fine. Nothing about it was harmful. But I hadn't picked it, and the agent
didn't mention that it wasn't Microsoft's.

I only found out because I was reading the agent's notes afterward. It said something about a "community
wrapper", and that sounded odd to me. Why would we need someone else's wrapper around something Microsoft
already makes? So I asked. I didn't realize at the time how much that question mattered.

Here's why it matters. Downloading software is a bit like buying something from a market stall with a
famous brand's name on the sign. The name tells you what the seller chose to call it. It doesn't tell you
who made it. In security, where something came from and who stands behind it is called provenance, and
"it installed without errors" says nothing about it.

What changed:

- Before an agent installs anything, it's supposed to tell me who makes it, what it brings along with it,
  and how to remove it. Then I decide. That's a written rule, not a lock, so it works only as well as it's
  followed.
- We swapped in Microsoft's own version, and cleaned out the extras.
- We started a list of every tool an agent can use on my machines, and why each one is there.

Then the list turned out to be wrong. A few days later we checked it against what was actually on my
computers, and found dozens of tools that probably belonged on it and weren't, including several AI agents, and five
programs that were missing security updates. Even the tool this all started with was running on whichever
copy of its supporting program the computer happened to find first, and nobody had written that down.

So the lesson is in two parts. Check who made what you install. And a list of what you have is only as good
as the last time you checked it against the real thing.

I'm still working out how often that checking should happen, and how to keep it light enough that it
actually gets done.
