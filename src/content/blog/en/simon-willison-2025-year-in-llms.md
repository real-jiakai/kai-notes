---
title: "2025: The Year LLMs Changed Everything - A Deep Dive into Simon Willison's Year-End Review"
description: "An analysis of Django co-founder Simon Willison's 2025 LLM year-end summary: reasoning models changed everything, Claude Code hit $1B ARR, Chinese open-source models dominated the rankings, OpenAI lost its lead, and $200/month subscriptions became the new standard."
pubDate: 'Jan 01 2026'
lang: 'en'
draft: false
---

# 2025: The Year LLMs Changed Everything - A Deep Dive into Simon Willison's Year-End Review

> **Original Article**: [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/) - Simon Willison
>
> This analysis is based on Simon Willison's year-end summary. A tribute to this Django co-founder and one of the sharpest observers in the LLM space.

---

## Preface: Why You Should Take Simon Willison Seriously

Simon Willison isn't one of those AI evangelists who just hypes everything up. He's the co-creator of the Django framework, the person who defined the term "prompt injection," and a board member of the Python Software Foundation. More importantly—he's a developer who uses LLMs for real work every day. In 2025, he built 110 tools with AI assistance.

When someone like this says "2025 was the year of XXX," it's worth paying attention.

---

## Key Insight #1: Reasoning Models Changed Everything

**Simon's Take**: Reasoning isn't about making AI count how many R's are in "strawberry"—it's about teaching AI to **work with tools**.

> "The real unlock of reasoning was in driving tools. Reasoning models with access to tools can plan out multi-step tasks, execute on them and continue to reason about the results."

**My Analysis**:

When o1 launched in late 2024, most people's reaction was: "Oh, it can do math problems now. What does that have to do with me?" This thinking was completely wrong.

The real value of reasoning models lies in:
- **Planning ability**: Breaking complex tasks into executable steps
- **Reflection ability**: Checking results after execution, adjusting strategies
- **Tool coordination**: Simultaneously invoking search, code execution, file operations, and other tools

What does this mean? It means AI evolved from a "Q&A machine" into an "executor."

![Reasoning Model Workflow](https://cdn.sa.net/2026/01/01/x4k1s3bDohnzfaS.webp)

---

## Key Insight #2: Agents Went from "Sci-Fi" to "Practical"

**Simon's prediction at year start**: Agents won't happen.

**Simon's admission at year end**: I was half wrong.

> "I didn't think agents would happen because I didn't think the gullibility problem could be solved... But if you define agents as LLM systems that can perform useful work via tool calls over multiple steps then agents are here."

**My Analysis**:

Simon's "eating his words" is actually quite enlightening. Where was he wrong? He imagined Agents as omnipotent assistants from sci-fi movies. But what are the Agents that actually shipped? **Claude Code**, **Codex CLI**—tools that can write code, run tests, and submit PRs for you.

Key insights:
1. **Agent ≠ general-purpose intelligent assistant**, but rather **domain-specific automation executor**
2. **Code** became the most mature landing scenario for Agents, because code execution results are verifiable
3. **Search** is the second mature scenario—deep research mode actually works now

Simon offers a pragmatic Agent definition: **"An LLM system that can achieve goals through iterative tool calls."** Not fancy, but effective.

---

## Key Insight #3: Claude Code Is the Most Important Product of 2025

**Simon's exact words**: "The most impactful event of 2025 happened in February, with the quiet release of Claude Code."

This might surprise many people. Not GPT-5? Not DeepSeek R1's market impact? A **command-line tool**?

**My Analysis**:

Claude Code represents a paradigm shift—**LLMs moving from chat interfaces to the terminal**.

Why does this matter?

1. **Developers' natural habitat**: The terminal is the most familiar environment for developers. Pipes, redirects, script composition—Unix philosophy merges perfectly with LLMs
2. **$1 billion ARR validation**: Anthropic announced Claude Code reached $1 billion annual revenue. A CLI tool! This shows professional users are willing to pay for truly useful AI tools
3. **Asynchronous execution breakthrough**: Claude Code for web can run in the background. Send a task, grab a coffee, come back and your PR is ready

In the cleaned software engineering benchmark SWE-rebench, Claude Code leads by a wide margin. Claude Code paired with Claude Opus 4.5 is the ultimate Vibe Coding combo. For bug fixes and code review, OpenAI's Codex GPT 5.2 xhigh excels.

![Claude Code Leads on SWE-rebench](https://cdn.sa.net/2026/01/01/o1pJ3teDyciH9dZ.webp)

---

## Key Insight #4: Chinese Open-Source Models Rose to Dominance

**Simon's data**: On the Artificial Analysis leaderboard, the top five open-source models are **all from China**.

> "GLM-4.7, Kimi K2 Thinking, MiMo-V2-Flash, DeepSeek V3.2, MiniMax-M2.1 are all Chinese open weight models."

![Top 5 Open-Source Models on Artificial Analysis Are All Chinese](https://cdn.sa.net/2026/01/01/8JKmB1CFXaQvglc.webp)

**My Analysis**:

DeepSeek R1 launched on January 20, 2025. That day, NVIDIA's market cap dropped $600 billion. This wasn't a tech event—it was a geopolitical event.

Key facts:
1. DeepSeek V3 training cost about $5.5 million, while US companies spend hundreds of millions
2. These models aren't just "open source"—they're **truly open source**—MIT or Apache 2.0 licenses
3. While training code and datasets aren't public, detailed technical papers have advanced the entire industry

What does this mean for you?
- The barrier to locally deploying top-tier models dropped significantly
- The reference point for API costs has been redefined
- The "AI is a US monopoly" narrative has been shattered

---

## Key Insight #5: OpenAI Lost Its Lead

**Simon's assessment**: "This year the rest of the industry caught up."

This doesn't mean OpenAI got worse, but rather:
- Image generation was surpassed by Google Nano Banana
- Code capability was challenged by Claude Opus 4.5
- Open-source models were crushed by Chinese vendors
- Audio API was threatened by Gemini Live

**My Analysis**:

OpenAI's advantage now is mainly **brand recognition**—"Nobody knows LLMs, but everyone's heard of ChatGPT." But in professional developer circles, this advantage is eroding.

After Google released Gemini 3 in December, OpenAI internally declared "Code Red." This was the first time OpenAI publicly acknowledged feeling competitive pressure.

A deeper issue: Google has its own TPUs and doesn't need to pay the "GPU tax" to NVIDIA. When training cost is a core competitive factor, this is a structural advantage.

---

## Key Insight #6: $200/Month Subscriptions Became the New Standard

**Fact**: Claude Pro Max, ChatGPT Pro, and Google AI Ultra all landed at the $200/month tier.

**Simon's personal experience**: "I've personally paid $100/month for Claude... I've heard from plenty of other people who are happy to pay these prices too."

**My Analysis**:

This reveals a bifurcation:
- **Casual users**: Free or $20/month is enough
- **Power users**: $200/month is a good deal

Why is it worth it? Because Coding Agents **consume tokens like crazy**. If you're using Claude Code daily for complex tasks, pay-per-API could easily exceed $200.

This also means: **LLMs are transitioning from "novelty toy" to "professional tool"**. Professional tools deserve professional pricing.

---

## Key Insight #7: YOLO Mode and the Danger of "Normalization of Deviance"

**Simon's warning**: "The longer we get away with running these systems in fundamentally insecure ways, the closer we are getting to a Challenger disaster of our own."

**Context**: YOLO mode = letting Coding Agents auto-execute all operations without human confirmation.

**My Analysis**:

This is Simon's most serious warning in the article. He cites sociologist Diane Vaughan's research on the Challenger space shuttle disaster—engineers knew about O-ring problems long before, but because multiple launches went fine, the risk was "normalized."

The AI analogy:
- You run Claude Code in YOLO mode daily without incident
- You start thinking prompt injection is only a theoretical risk
- Until one day, a malicious instruction actually deletes your home directory

Johann Rehberger calls this "**normalization of deviance in the AI space**." Simon clearly agrees.

---

## Key Insight #8: MCP Might Be a Flash in the Pan

**Simon's observation**: "The reason I think MCP may be a one-year wonder is the stratospheric growth of coding agents."

**Core argument**: When Agents can run arbitrary Bash commands, who needs MCP?

**My Analysis**:

MCP (Model Context Protocol) was launched by Anthropic in November 2024 and exploded in early 2025—OpenAI, Anthropic, and Mistral all announced support within eight days.

But Simon points out an awkward fact: **Bash is the ultimate tool**. An Agent that can run shell commands can invoke any CLI tool—git, gh, ffmpeg, curl—why wrap another layer of MCP?

Anthropic itself seems to have realized this, launching the lighter **Skills** mechanism: a Markdown file plus optional scripts, much simpler than MCP's JSON-RPC server.

---

## Key Insight #9: Local Models Are Good, But Cloud Models Are Better

**Simon's mixed feelings**:
> "I got small amounts of real work done offline! My excitement for local LLMs was very much rekindled."

But also:
> "I have yet to try a local model that handles Bash tool calls reliably enough for me to trust that model to operate a coding agent on my device."

**My Analysis**:

Local models indeed improved massively in 2025:
- Mistral Small 3 (24B) ≈ GPT-4 level, runs on 64GB laptops
- 20-32B parameter range became the sweet spot
- Can do some real work offline

But the problem is **reliability**. Coding Agents need models to stably invoke tools dozens or even hundreds of times. Local models can't do that yet.

Simon's conclusion: Next laptop needs at least 128GB RAM, but the main workhorse remains frontier cloud models.

---

## Key Insight #10: "Slop" Became Word of the Year

**Merriam-Webster's definition**: "Low-quality digital content mass-produced through artificial intelligence"

**Simon's optimistic lean**:
> "The internet has always been flooded with low quality content. The challenge, as ever, is to find and amplify the good stuff."

**My Analysis**:

The popularity of "Slop" (AI junk content) as a word reflects growing public vigilance toward AI-generated content. This is good.

But Simon raises a deeper question: **Can you perceive slop's impact?**

His own answer: Probably not. Because he doesn't use Facebook and carefully curates his information sources. For average users who don't? They might be drowning in slop without knowing it.

---

## Key Insight #11: Data Centers Are Becoming Extremely Unpopular

**Fact**: Over 200 environmental groups demanded a moratorium on new US data center construction.

**Simon's focus**: Water resource concerns might be overstated (a distraction), but energy consumption is **real**.

**My Analysis**:

This is the only section touching on AI ethics/social impact, and Simon's stance is cautious.

He points out the **Jevons paradox**: Cost per token drops → users consume more tokens → total energy consumption rises instead of falling.

$200/month subscription users might consume 10x the compute resources of $20 users. Efficiency gains are offset by usage growth.

---

## My Summary: The Thinking Framework Simon Willison Teaches Us

After reading this 13,000-word year-end summary, what I learned isn't just 26 trends, but a **methodology for observing the AI industry**:

1. **Hands-on practice**: Simon isn't a commentator—he built 110 tools and uses these technologies daily
2. **Admitting mistakes**: He predicted Agents wouldn't happen at year start, and candidly admitted he was half wrong at year end
3. **Defining terms**: "prompt injection," "slop," "lethal trifecta"—clear concepts are prerequisites for clear thinking
4. **Security awareness**: Even while using YOLO mode daily, he doesn't forget to warn about "Challenger disaster" risks
5. **Staying curious**: A 44-year-old Django founder still researching mobile programming

If you want to keep up with LLM developments, there's no better way than following Simon Willison.

---

## Appendix: Key Terms Created/Popularized by Simon Willison in 2025

| Term | Meaning |
|------|---------|
| **Vibe Coding** | Generating code entirely through prompts, "forgetting the code exists" |
| **The Lethal Trifecta** | Access to private data + ability to communicate externally + exposure to untrusted content |
| **Context Rot** | Model output quality degrading as conversations grow longer |
| **Slopsquatting** | Registering malicious packages using package names hallucinated by LLMs |
| **Asynchronous Coding Agent** | Tools that run in the background and submit PRs when complete |

---

> **Original**: [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)
>
> If you found this analysis valuable, subscribe to Simon's blog: RSS, email, or Bluesky/Mastodon. $10/month also gets you his monthly newsletter.

## Notes

This article was co-authored by the author with Claude Opus 4.5 and Gemini 3 Pro.
