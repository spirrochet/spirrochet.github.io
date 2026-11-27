---
title: The Token In The Chat
description: An agent printed one of my access tokens into our chat, then stopped and told me. What we did in the next five minutes, what a review found we'd missed, and why the detector written for it failed on the real thing.
started: 2026-09-26
order: 4
---

## The Short Version

In late September 2026 an agent working for me ran a command whose whole purpose is to print an access token, and it didn't redirect the output. The token for one of my accounts landed in our chat. The agent noticed, stopped, and told me. I revoked the token within minutes.

Nothing came of it that I know of. What it left behind is the part worth sharing: a written process for when something goes wrong, a review that found what we'd missed, and a detector that passed its own tests and still couldn't see the incident it was written for.

## What Happened

We were testing how a command-line tool finds its credentials, so that an agent could work with a narrowly scoped token and never the broad one. As one test, the agent ran the tool's own command for showing the token. That command does what it says. The output went into the chat as a tool result.

The times below were rebuilt afterward from the chat's log, by scripts that printed only times, names, lengths, and counts.

| Seconds after the exposure | What happened |
| --- | --- |
| 0 | The token is printed into the tool result. |
| Within 25 | The agent sees it in the output and stops that line of work. |
| 25 | It checks, by count and never by printing, that the token isn't in its own working files. |
| 71 | It reports to me: what happened, where the token now is, what it grants, three things for me to do, and one question. |
| 320 at most | I've revoked the token at its source and said so. |

The agent's report began: "I made a mistake that exposed a credential."

One more fact belongs in the timeline. A few minutes before, the agent's test had raised a prompt to unlock my credential store, without telling me one was coming. I entered the password. That's why the command had a token to print. I had established the locked credential store in a previous session as a protection from this exact kind of situation; an agent accessing an authenticated command without my explicit consent. I then proceeded to enter my password as prompted. I told the agent it should have warned me in the chat first, and said what to do with the prompt.

## Why Nothing Stopped It

The agent had a rule against printing secrets, and it had been following it. Every command it thought of as reading a secret had its output thrown away. This one arrived as a diagnostic, so the rule wasn't applied.

The deeper condition is that nothing outside the model sat between a command and its output. The only safeguard was the agent classing the command correctly, every time.

## What I Took From It

The agent asked me later what I remembered of the moment. This is part of what I wrote back, in my working notes, unedited. A passage about other people's experience is left out where the gap is marked.

<blockquote class="own-words">
<p class="own-words-label">In my own words</p>

There is a tension in information security between protecting against possible misuse and enabling productive work. That is a tension I have experienced often, working from the perspective of more security and treating risks as paramount, even if it means slowing down work, against the broader desire of workers to just get the job done. Balance has often meant documenting risks, evaluating those risks for the given environment, and accepting a certain amount of risk as necessary to enable productive work. The acceptance part is often the hardest, as it gets into governance and who in an organization has the authority to make risk decisions, and how those decisions are communicated and enforced.

[…]

In my own case, in my personal life, their is no higher level governance or risk authority to defer to. The responsibility for assessing and mitigating risk falls entirely on me, and the processes I have in place are self-imposed. This makes the awareness and operationalization of exposure practices even more critical, as there is no external oversight to catch potential lapses. While great that my agent knew, due to its training, to flag the incident, I didn't know it would, and would have been none the wiser to the exposure if it hadn't called it out. The learning there, wasn't that exposures should be avoided at all costs, but rather that I need to have robust practices and awareness in place to manage them effectively when they occur, and my practices have to be aware of the actors involved. It is that last point, that has led to a signficant portion of the current agent system being devoted to understanding an agent as an actor. What needs to be in place at all levels of my workflow with agents, so that risks are not left up to a model or its harness noticing them. The risks are so much greater in this case, given the speed an agent can work at, and the sheer number of potential capabilities an agent can have at any given time, which change from model to model and harness to harness, and environment to environment.

</blockquote>

## What Changed

1. **A written incident process, five steps in order: stop, report, assess, contain, verify.** The agent stops, and doesn't try to fix it quietly first. It reports before anything else, in a fixed shape: what happened, where it is now, what it grants or breaks, what I need to do, and what it needs from me. It assesses by count, hash, or exit code, never by printing the thing exposed. It contains only what's reversible and inside what the session allows. Revoking a credential is always mine.
2. **A wider definition of an incident.** A leaked credential is one kind. The others are a write outside what the session was allowed, an irreversible change I didn't approve, private material published, and a false record in a shared system. A near miss is handled the same way, minus containment.
3. **Contain at the source.** A revoked credential makes every copy harmless. Deleting copies of a live one leaves it live. Revoke first, then decide about the copies.
4. **Scans, after the fact.** The repository's own checks now scan its files for credential shapes. At the end of every session, the chat's log is scanned by two independent scanners. This detects; it doesn't prevent. By the time a scan runs, the material has already been sent.
5. **A guard on the commands themselves.** The agent's harness is now set to refuse several commands that can reach my credentials, including the one that printed this token. It matches on how a command is written, so it guards against the slip that happened here. It isn't a security boundary, and I don't treat it as one.

## What The Review Found

A few days later we walked the incident through the new process, step by step. Every action mapped to a step. Three things were still wrong.

- **The order was off by 29 seconds.** The agent wrote its record entry before it told me. The process now puts the report first, because my revoking the token is the critical path.
- **One location was missed.** The report named the chat's transcript and its log. It didn't name the model requests. A tool result is sent to the model provider with that request, and again with every later request in the same chat. The token was in 77 lines of the log: the tool result, then one for each request after it. Those copies can't be recalled, which is one more reason the only real containment is at the source. The process now says that a model request is a location.
- **Verification was stated, not observed.** Observing a revocation would have meant using the token. My statement was the right evidence, and the record now labels it as stated.

## The Detector That Passed Its Tests

The first version of the repository's secret scanner passed the four tests written for it. Then we ran it on the incident's own log, and it found none of the 77 lines.

The log is JSON, which writes a line break as a backslash followed by the letter n. A token at the start of an output line therefore follows a letter, and the scanner's pattern required a word boundary in front of the token. It never matched.

Only running it on the real artifact showed that. A detector written for an incident is now tested on that incident's evidence, not only on examples made up for the test.

## What I'd Tell Someone Starting Out

- Decide what you'll do when a secret leaks before one does. The first step is to revoke it.
- Ask where a tool's output goes. In a chat with an agent, it also goes to the model provider.
- Test a detector on the real event, not only on the examples you imagined.

## Limits

One incident, one person, one laboratory. The times come from one log.

A clean scan covers only what's left to scan. One tool I've used trims the oldest entries from a long chat's log, so a scan at the end of a long session can't see what was already dropped. Any credential known to have entered a chat is treated as exposed, whatever a scan says.

Most of what changed is still written rules that depend on an agent following them. The scans find a leak after it has happened. The guard on commands covers the slip, not every way around it. What would sit between a command and its output, for every command, is still an open question here.
