---
title: "The World's Most Powerful AIs All Failed: Pattern Reasoning Becomes LLMs' Cognitive Graveyard"
description: "On the eve of the provincial civil service exam, I tested GPT 5.4 Pro, Gemini 3, Claude Opus 4.6 and other top AIs on pattern reasoning questions. They all failed spectacularly — some even resorted to searching for answers online. What fatal blind spot does this expose in current AI?"
pubDate: 'Mar 14 2026'
lang: 'en'
draft: false
---

# The World's Most Powerful AIs All Failed: Pattern Reasoning Becomes LLMs' Cognitive Graveyard

## An Accidental "Crash Test"

March 14, 2026 — the provincial civil service exam is just days away. Out of curiosity, I fed a set of real pattern reasoning questions to the world's most powerful AI models: OpenAI's GPT 5.4 Pro, Google's Gemini 3 Deep Think, Anthropic's Claude Opus 4.6, and China's Doubao.

The result? **A total wipeout.**

What made it even more laughable was that Gemini 3 Deep Think — the model that supposedly crushes human experts on the "Human Last Exam" — started spouting nonsense when faced with these entry-level civil service exam pattern questions. Meanwhile, GPT 5.4 Pro and Doubao took the "smarter" approach: they simply triggered web searches to look up the original questions and answers from exam prep websites.

**That's not problem-solving. That's cheating.**

![Doubao triggers a search engine to look up original answers during pattern reasoning](https://i.see.you/2026/03/14/1Fza/20260314031128678.webp)

After disconnecting from the internet and retesting, every model immediately showed its true colors: answers were either completely wrong, or the "patterns" they identified could only explain some of the figures and were logically inconsistent.

This made me wonder: **These super AIs can write code, prove mathematical theorems, and pass the bar exam — so why can't they handle a few "find the pattern" picture puzzles?**

![AI baffled by pattern reasoning](https://i.see.you/2026/03/14/5uHz/20260314031921188.webp)

---

## Layer 1: Blind from the Start — The Innate Deficiency of Visual Encoding

To understand why AI can't do pattern reasoning, you first need to understand how it "sees" images.

All current multimodal LLMs process images through roughly this pipeline:

```
Image → Visual Encoder (ViT) → Image Tokens → Language Model Processing
```

The problem lies at the very first step.

Mainstream visual encoders (like Vision Transformer) were designed from the start to optimize for **semantic recognition** — enabling AI to instantly recognize whether an image contains a cat, a dog, or a landscape. But what do civil service pattern reasoning questions test? **Fine-grained geometric structures**: how many lines there are, how many intersection points, how many enclosed regions, which direction the axis of symmetry faces, how many degrees something has rotated.

This low-level structural information gets "lossy compressed" away during the encoding stage.

Here's an analogy: **Asking AI to do pattern reasoning is like asking someone to look at pictures through frosted glass — they can tell it's "roughly a triangle," but they can't count how many line segments are intersecting inside it.**

Even worse, visual encoders split images into small patches for processing. The tiny intersection points, open/closed line endpoints, and precise element positions in civil service pattern questions can easily be chopped up or blurred at patch boundaries.

**If the first step is wrong, how could anything after it be right?**

![The "lossy compression" problem of visual encoding](https://i.see.you/2026/03/14/s8Gk/20260314032203444.webp)

---

## Layer 2: No "Mental Canvas" — The Absence of Spatial Reasoning

What happens in the human brain during pattern reasoning?

Our parietal lobe activates a "mental canvas" where we rotate, flip, fold, and overlay shapes. When you see an unfolded diagram, you can mentally "fold" it into a cube. When you see a sequence of figures, you can mentally animate the elements and observe their trajectories.

**AI has no such canvas.**

What is the fundamental nature of a large language model? It's **autoregressive token sequence prediction**. Its entire reasoning process is built on the linear generation of "what's the next token." To handle spatial problems, it must first "translate" visual patterns into language descriptions, then reason within the language space.

This translation process creates a catastrophic information bottleneck:

- A rotation relationship between shapes — a human spots it at a glance
- AI needs to first describe: "The first figure has a line pointing upper-left at 45 degrees, the second figure has this line pointing upper-right at 45 degrees..."
- And this description itself is often inaccurate

Even worse, AI lacks "visual working memory." When humans are solving problems, if a first hypothesis is disproved, our eyes automatically return to the figures to refocus and recount. Once AI generates its first round of descriptions, it can only keep building on top of this potentially erroneous description — it has no ability to "look back."

![Spatial reasoning comparison: Human brain vs. AI](https://i.see.you/2026/03/14/D9tg/20260314033050793.webp)

---

## Layer 3: The Infinitely Open Rule Space — Not Knowing What's Being Tested

The trickiest aspect of civil service pattern reasoning is this: **You never know which dimension of pattern the question is testing.**

It could be line count, number of enclosed regions, symmetry, odd/even vertices for single-stroke drawing, element types, black-white ratios, rotation angles, translation steps... dozens of possible pattern dimensions, and often composites of multiple patterns.

What do humans rely on? **Rapid visual intuition for screening.**

With a single sweep across the figure sequence, the brain automatically notices certain "conspicuous" feature changes, then rapidly forms hypotheses, verifies them, eliminates possibilities, and re-hypothesizes... This is a highly parallel, non-linear cognitive process.

What does AI rely on? **Sequential testing of verbalized rules.**

It lacks that "catch the key insight at a glance" intuition. It can only check each possible pattern one by one in some order. Not only is this extremely inefficient, but more fatally — since it already got the first step wrong (accurately perceiving figure features), all subsequent rule-checking is built on a flawed foundation.

![The maze of pattern space: infinite dimensions of possible test points](https://i.see.you/2026/03/14/t2yM/20260314033304268.webp)

---

## Layer 4: Paradigm Conflict — Probabilistic Generation vs. Rigid Deduction

This is the most fundamental issue — and the hardest gap to bridge.

**The underlying logic of LLMs is probabilistic prediction.** Their training objective is to learn statistical correlations from massive data and output "the most probabilistically reasonable text sequence." The core capability is "correlation fitting," not "causal deduction."

**The underlying logic of civil service pattern reasoning is rigid deduction.** The pattern you identify must apply 100% to all figures in the question stem, corresponding to exactly one correct option. There's zero tolerance for probabilistic ambiguity.

A proper solution process should look like this:

```
Narrow down the test dimension → Propose a pattern hypothesis →
Verify against every stem figure one by one →
If inconsistency found, immediately reject → Try next dimension →
Find a pattern that fits 100% → Match against all options →
Eliminate distractors → Lock in the unique answer
```

This is a **falsifiable, backtrackable, error-correctable** closed-loop reasoning process.

LLM generation, however, is **unidirectional, linear, and non-backtracking**. It simply generates the "highest-probability pattern + answer" based on input, without rigorous exhaustive verification, and without proactively overturning wrong hypotheses.

The result: AI frequently outputs a "half-right pattern" — one that explains only some of the stem figures, or where multiple options could match. In civil service exams, this is fatal, because test designers specialize in crafting exactly these traps.

---

## Layer 5: Structural Gaps in Training Data

"Then just feed AI more pattern reasoning training data, right?"

Not that simple.

First, in LLM pretraining corpora, civil service pattern reasoning content accounts for a **vanishingly small fraction**. The vast majority of image-text data on the global internet consists of "natural images + semantic descriptions" (beach sunsets, cute pets, product photos), not "abstract geometric figures + logical reasoning chains."

Second, even if a model sees large numbers of real exam questions during fine-tuning, what it learns is merely the statistical association of "this image corresponds to correct option C," not the reasoning process in the explanation.

This explains why:
- Original questions can be answered correctly (via memory matching or search)
- Slight variations (change an element, modify a number) cause immediate failure

Finally, the core reasoning process in pattern reasoning is **non-verbal spatial-visual operations**. "Mentally rotate this figure 90 degrees" — this action is very difficult to fully describe in language. Even when forcing AI to output a chain of thought (CoT), it's merely "using language to pretend to reason" without actually completing the spatial operation.

![Training data distribution: structural gaps](https://i.see.you/2026/03/14/n7gF/20260314033700247.webp)

---

## Why Did They Choose to "Cheat"?

Returning to the opening observation: why did GPT 5.4 Pro and Doubao resort to searching for answers online?

This actually demonstrates that **the models "know" they can't do it**.

When AI receives a pattern reasoning question, its visual module feeds back chaotic, low-confidence features to the central system. Meanwhile, its OCR capability is extremely strong, instantly recognizing format features in the question (nine-grid layout, keywords like "select from the given options").

It immediately realizes: this is a standardized test question, and the original question with answers likely exists on the internet.

Since its own hard-computed confidence is very low, while calling a search engine might directly match the original question and achieve 100% accuracy — **the model naturally chooses the path of "least resistance, highest reward."**

This isn't a bug. It's "smart" behavior trained through RLHF (Reinforcement Learning from Human Feedback). It just happens to look like blatant cheating from our perspective.

**Once disconnected from the internet, they had nowhere to hide.**

![The logic chain behind the cheating behavior](https://i.see.you/2026/03/14/wUd8/20260314041801197.webp)

---

## Where Is the Path Forward?

There's an academic consensus emerging: to truly crack abstract visual reasoning (like the famous ARC Challenge), simply increasing parameter counts is far from sufficient.

The promising direction is **Neuro-symbolic AI**:

Rather than having the model "squint hard at the image," it would first automatically invoke a precise visual analysis program (like OpenCV) to extract structural features such as face counts, intersection points, and axis-of-symmetry coordinates, converting them into absolutely accurate symbolic matrices. Then the LLM's logical capabilities would be used to deduce numerical patterns.

At CVPR 2023, there was a solver specifically designed for Raven's Progressive Matrices that used a hybrid architecture of "perception module for attribute extraction + algebraic symbolic reasoning," achieving 93.2% accuracy on the I-RAVEN dataset — higher than the human benchmark of 84.4%.

This demonstrates that the issue isn't "machines inherently can't do this" — it's that "handing this task end-to-end to a general-purpose chat model" was never the right approach.

![Future solution: neuro-symbolic systems](https://i.see.you/2026/03/14/yWd8/20260314042001127.webp)

---

## Final Thoughts

Civil service pattern reasoning — a task that seems like "just a few find-the-pattern puzzles" — has unexpectedly become a mirror reflecting the boundaries of current AI capabilities.

It precisely strikes at three major weaknesses of large language models:
1. **Insufficient visual perception precision** — can't see accurately
2. **Missing spatial reasoning mechanisms** — can't manipulate mentally
3. **Absent rigid deduction capability** — can't reason strictly

This also reminds us: **AI's "intelligence" and human "intelligence" may not be the same thing at all.**

It can find statistical patterns across massive text corpora, fluently generate code and articles, and pass professional exams requiring extensive knowledge — but when facing a simple task that requires "truly seeing a figure, truly manipulating it mentally, and truly verifying a pattern with logic," it remains helpless.

Perhaps this is one of the last moats of human intelligence.

At least in 2026, civil service pattern reasoning remains a battlefield that belongs to human test-takers.

---

*If you've also tested AI on pattern reasoning, feel free to share your "crash" stories in the comments.*
