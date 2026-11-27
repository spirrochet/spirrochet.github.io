---
title: When The Agent Printed A Secret
description: An AI agent working for me printed one of my access keys into our chat, then stopped and told me. What happened in the next few minutes, and what I changed afterward.
caseStudy: the-token-in-the-chat
order: 4
---

An AI agent working for me printed one of my secret keys into our chat. Then it stopped what it was doing and told me.

The key was an access token: a long string of characters that lets a program act as me on one of my online accounts. It's supposed to stay where it's stored. We were testing how a tool finds its keys, and the agent ran a command that shows the key. So the key was shown, right there in the conversation.

Within half a minute the agent noticed and stopped. About a minute after the slip, it sent me a message that began, "I made a mistake that exposed a credential." It told me where the key now was, what the key could open, and what I needed to do. A few minutes later I had canceled the key, which made every copy of it useless.

Nothing bad came of it, as far as I know. One thing stayed with me, though. This is from my notes, written later:

<blockquote class="own-words">
<p class="own-words-label">In my own words</p>

While great that my agent knew, due to its training, to flag the incident, I didn't know it would, and would have been none the wiser to the exposure if it hadn't called it out. The learning there, wasn't that exposures should be avoided at all costs, but rather that I need to have robust practices and awareness in place to manage them effectively when they occur, and my practices have to be aware of the actors involved.

</blockquote>

What changed:

- There's now a written plan for when something goes wrong: stop, tell me, work out where the problem has spread, contain it, and confirm it's contained. Canceling a key is always my job, never the agent's.
- At the end of every working session, the conversation's log is searched for anything that looks like a key. That finds a leak after the fact. It doesn't prevent one.
- The agent's tools are now set to refuse several commands that can show keys, including the one from that day. It's a guard against a slip, not a locked door.

One surprise came afterward. We wrote a small program to search for leaked keys, and it passed all of its tests. Then we tried it on the actual log from that day, and it found nothing. The key was there. The program had been tested on made-up examples that didn't look enough like the real thing.

So I took two lessons. Plan for the leak before it happens, because the first few minutes matter most. And test your safety checks on the real event, not only on the examples you imagined.
