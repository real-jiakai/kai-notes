---
title: "🦞 A Lobster's Rise: From Clawdbot to OpenClaw - What Did This AI Crustacean Go Through?"
description: "From 0 to 100K stars in two months, legal notice from Anthropic, crypto scammers hijacking the brand - this open-source lobster's transformation is more dramatic than a TV series"
pubDate: 'Jan 30 2026'
slug: 'clawdbot-moltbot-openclaw-evolution'
draft: false
lang: 'en'
---

![Cover Image](https://cdn.sa.net/2026/01/30/TFioCsD1f6QX4G3.webp)

# A Lobster's Rise: From Clawdbot to OpenClaw - What Did This AI Crustacean Go Through?

**"Two months ago, I just spent a weekend casually building a small project. Now it has over 100K stars on GitHub and attracted 2 million visits in a single week."**

These are the words of Peter Steinberger (@steipete), the founder of OpenClaw.

You might not know him, but you've probably used his products - he's the founder of PSPDFKit, the PDF framework that almost every iOS developer has heard of. After the company was acquired in 2023, Peter planned to retire and enjoy life. Instead, he accidentally created one of the fastest-growing open-source projects in GitHub history.

Imagine: a weekend project you casually built suddenly goes viral worldwide, and even Anthropic's (Claude's parent company) legal team reaches out...This plot is more dramatic than a TV series.

Today, let's talk about the story of this "lobster's" rise.

---

![Evolution Timeline](https://cdn.sa.net/2026/01/30/TcgrCwfuSDmzn8N.webp)

## 🦞 Chapter 1: The Birth of Clawdbot - A "Copycat" Lobster's Debut

In November 2025, Peter had a sudden inspiration: he wanted to build an AI assistant that he could use on WhatsApp.

Initially, it was just a little thing called "WhatsApp Relay." But Peter got more and more into it, eventually giving it a proper name: **Clawdbot** - Claude (Anthropic's AI) + Claw (lobster claw), complete with a cute lobster mascot called Clawd.

> Yes, it's a pun.

What's special about this "weekend project"?

**It runs entirely on your own computer.**

Not one of those "upload your data to someone else's server" SaaS services, but truly "your computer, your API keys, your data." Laptop, home server, VPS - your choice.

As one community member put it: **"This is infrastructure that truly belongs to you."**

Clawdbot quickly spread through developer circles. GitHub stars broke 9,000 within 24 hours, and it surpassed 100K two months later. After all, who wouldn't want an AI assistant that can help you reply to emails, check your calendar, and be ready to serve across 13 platforms including WhatsApp, Telegram, Discord, Slack, Signal, and iMessage?

Moreover, it remembers everything about you - your preferences, your habits, your previous conversations. It reads your SOUL.md to understand your personality and MEMORY.md to remember your history.

**"This thing is way smarter than Siri!"** someone commented.

Others remarked: **"2026 is truly the year of personal AI agents."**

---

## 🔄 Chapter 2: Moltbot - The Awkward Moment of Forced "Molting"

In January 2026, just when Clawdbot was at its peak, Peter received an email.

From: Anthropic Legal Team.

The content was polite, but the message was clear: **"Clawdbot and Clawd are too similar to our Claude. Please change the name."**

Peter was reasonable about it. After all, they're a multi-billion dollar company, and he's just an individual developer - no need to fight back.

But the question was: what to change it to?

At 5 AM on January 27th, Peter launched a "naming convention" on Discord. Community members went wild with ideas, and finally settled on **Moltbot**.

**Molting** is how lobsters grow - they shed their old shell to grow a bigger new one. This meaning was too perfect: the project was also experiencing a transformation, becoming stronger.

Peter himself was satisfied: **"Anthropic asked us to rename (trademark issue), honestly? 'Molt' is perfect - that's how lobsters grow."**

The mascot also changed from Clawd to Molty.

But renaming came with more than a few headaches:

- Old users were confused: "Why did Clawdbot suddenly stop working?"
- Someone registered the old brand's social accounts within 10 seconds to post crypto scam messages
- A fake $CLAWD token pumped to $16 million market cap before crashing
- All the old repository links on GitHub became invalid

Peter had to urgently contact friends at X (Twitter) and GitHub to get these issues under control.

> This experience teaches us: rebranding is truly a tough battle. And internet scammers are always faster than you.

---

## ✨ Chapter 3: OpenClaw - The Lobster's Final Form

Just two days later, on January 29th, Peter announced: **The final name is decided - OpenClaw.**

Wait, another change?

It turned out that "Moltbot," despite its nice meaning, still had some trademark and domain issues. This time, Peter was prepared:

- ✅ Trademark search passed
- ✅ All domains secured (openclaw.ai)
- ✅ Migration code written in advance
- ✅ `openclaw doctor` command automatically handles config migration

**Open** represents open source, openness, and community-driven development.
**Claw** is a tribute to the lobster heritage, also implying this is an AI that can "take action."

In Peter's words: **"The lobster has finally completed its ultimate molt. Welcome to OpenClaw."**

(By the way, the mascot is still that lobster Molty - some things are sacred and cannot be changed🦞)

---

![Feature Showcase](https://cdn.sa.net/2026/01/30/x4d1UakA2XwTVW8.webp)

## 🚀 What Can OpenClaw Do Now?

I have to say, after all these rounds of evolution, OpenClaw has become a quite mature AI assistant platform. With 107K+ stars, 15K+ forks, and 8,300+ commits on GitHub, these numbers represent an active global community.

### 📱 Full Platform Coverage

WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Google Chat, Microsoft Teams, Matrix...supporting **13 messaging platforms** in total. Wherever you chat, it follows you there.

### 🧠 True "Memory"

Unlike those AIs that "forget after chatting," OpenClaw remembers everything about you:

- **AGENTS.md** — Agent configuration file
- **SOUL.md** — Personality settings
- **TOOLS.md** — Tool preferences
- **MEMORY.md** — Memory storage

**It truly gets to know you better over time.**

### 🎙️ Voice Activation

Supports "Always-on Speech" feature on macOS, iOS, and Android, with natural voice interaction through ElevenLabs. Imagine just calling out to your phone to have the AI help you with tasks.

### 🌐 Browser Control + System Access

Let it help you:

- Browse web pages, fill forms, scrape data
- Read and write files, run scripts, execute commands
- Achieve web automation through a dedicated Chrome/Chromium instance
- Even extend functionality through 700+ community skills

### 🔒 Security First

In this renamed version, the team committed **34 security-related code updates**. It uses Docker sandbox mode by default to isolate non-primary sessions and supports tool whitelist and blacklist configurations.

Peter specifically reminds: Prompt injection remains an industry challenge. It's recommended to use strong models like Claude Opus 4.5 and follow security best practices.

---

## 🛠️ Migration Guide for Existing Users

If you've used Clawdbot or Moltbot before, don't worry - migration is super simple. The installation script will automatically handle everything for you.

### One-Click Upgrade to OpenClaw

```bash
# Run the installation script, it will automatically detect old configs and migrate
curl -fsSL https://openclaw.ai/install.sh | bash
```

It's that simple. The installation script will automatically:

1. Detect your system environment (macOS/Linux)
2. Verify Node.js version (requires v22+)
3. Install the latest version of OpenClaw
4. Run `openclaw doctor` to auto-migrate configurations

You'll see output like this:

```
◇  Doctor changes ─────────────────────────────────────────────────────────╮
│  - State dir: ~/.clawdbot → ~/.openclaw (legacy path now symlinked)      │
│  - Migrated legacy config: ~/.clawdbot/clawdbot.json →                   │
│    ~/.openclaw/openclaw.json                                             │
├──────────────────────────────────────────────────────────────────────────╯
```

### Optional: Clean Up Old Versions

After migration, if you want to completely remove old versions:

```bash
# Uninstall old Clawdbot (will ask which components to delete)
clawdbot uninstall

# Or uninstall Moltbot
moltbot uninstall
```

### Important Notes ⚠️

- Old `clawdbot` and `moltbot` commands still work after migration
- Old config directories are symlinked to the new location, no worry about data loss
- Existing Skills and workflows need no modification
- If you encounter issues, run `openclaw doctor --fix` to auto-repair

### Version Comparison Table

| Item | ClawdBot | MoltBot | OpenClaw |
|------|----------|---------|----------|
| Config Directory | ~/.clawdbot/ | ~/.moltbot/ | ~/.openclaw/ |
| Website | clawd.bot | molt.bot | openclaw.ai |
| GitHub | clawdbot/clawdbot | moltbot/moltbot | openclaw/openclaw |
| NPM Package | clawdbot | moltbot | openclaw |

---

![Community](https://cdn.sa.net/2026/01/30/et9GQV1NnSRCILT.webp)

## 🔮 Future Outlook

OpenClaw's story is far from over.

Peter is working on several big things:

1. **Security Hardening (Top Priority)** — Continuously strengthening codebase security
2. **Gateway Reliability Improvements** — Making it smoother for more people to use
3. **Expanding Model Support** — Already supports KIMI K2.5, Xiaomi MiMo-V2-Flash, and other new models
4. **Establishing Sustainable Funding** — Wanting to pay core maintainers full-time salaries
5. **Expanding the Maintainer Team** — One person really can't handle it all

Community members have already done super cool things with OpenClaw:

- Automatically managing emails and calendars
- Remotely controlling code compilation and testing
- Using Sentry webhooks to automatically catch errors and submit PR fixes
- Secure remote access through Tailscale

One user put it well:

> **"The open-source community built a product better than Apple's Siri with just a few people. Welcome to the AI era - one person plus one code repository can fill the gap left by trillion-dollar companies."**

---

## 📝 Final Thoughts

From Clawdbot to Moltbot to OpenClaw, this lobster has been through quite a lot.

Targeted by Anthropic's legal team, exploited by crypto scammers, renamed twice within two days...

But it's still alive, and thriving more than ever.

**107K+ GitHub stars, 15K+ forks, 2 million weekly visits, a global developer community...**

Behind these numbers is a simple belief:

> **Your AI assistant should truly belong to you. 100% open source, MIT license, forever free.**

If you'd like to try this "lobster," check out the official website:

- 🌐 Website: https://openclaw.ai
- 💻 GitHub: https://github.com/openclaw/openclaw
- 📖 Documentation: https://docs.openclaw.ai
- 💬 Discord Community: https://discord.gg/openclaw

Perhaps it will become your most capable digital assistant of 2026?

After all, lobsters molt to grow bigger. And OpenClaw is just beginning its growth journey. 🦞

---

**References:**
- [Introducing OpenClaw](https://www.molt.bot/blog/introducing-openclaw)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
- [From Clawdbot to Moltbot - DEV Community](https://dev.to/sivarampg/from-clawdbot-to-moltbot-how-a-cd-crypto-scammers-and-10-seconds-of-chaos-took-down-the-4eck)
