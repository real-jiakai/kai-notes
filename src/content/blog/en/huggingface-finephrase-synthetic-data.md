---
title: "The Industrial Recipe for Synthetic Data: HuggingFace's 90 Experiments Reveal the Laws of Pretraining Data Production"
description: "HuggingFace spent 12.7 GPU-years running 90 controlled experiments, finally turning the 'alchemy' of synthetic data for LLM pretraining into reproducible 'chemistry.'"
pubDate: 'Mar 11 2026'
lang: 'en'
draft: false
---

# The Industrial Recipe for Synthetic Data: HuggingFace's 90 Experiments Reveal the Laws of Pretraining Data Production

> As LLM training enters the era of "data is king," efficiently generating high-quality synthetic data has become a critical challenge. HuggingFace spent 12.7 GPU-years running 90 controlled experiments, finally turning this "alchemy" into reproducible "chemistry."

---

![Synthetic Data: The New "Data Factory" for LLM Training](https://i.see.you/2026/03/11/9sRt/20260311013838016.webp)

---

## I. Synthetic Data: The Fourth Paradigm Shift in LLM Training

The pretraining data for large language models has gone through several clear evolutionary stages.

Initially, researchers trained language models on small but high-quality corpora like Wikipedia. Then, datasets like C4 and The Pile pushed the scale to hundreds of gigabytes. Next, projects like FineWeb and DCLM expanded data volumes to trillions of tokens, covering nearly the entire crawlable internet.

Once web text approached its collection limit, the focus shifted to quality filtering: using neural network classifiers to find "educational" or "instructional" content, filtering massive noisy data down to curated subsets.

Now, the fourth paradigm is taking shape — **synthetic data**.

NVIDIA's Nemotron-CC rewrote approximately 2 trillion tokens of web text, Zhipu's GLM-4.5 series generated 500 billion reasoning tokens for mid-training, and frontier models like Qwen3 and Phi-4 heavily incorporate synthetic content in their training data. Synthetic data has evolved from an "optional augmentation technique" to a "standard production step."

But the question remains: **How exactly should you do it?**

Which model should generate the data? What prompts should you write? Does source data quality matter? Should you mix it with original data? These questions were previously answered mostly by intuition and trial-and-error. The HuggingFace team decided to answer them with systematic experiments.

---

## II. 90 Experiments, 1 Trillion Tokens, All to Answer One Question

The HuggingFace research team designed a large-scale ablation experiment framework:

- **Experiment scale**: 90 complete train-evaluate cycles
- **Generation volume**: Over 1 trillion tokens of synthetic text
- **Compute cost**: Approximately 12.7 GPU-years (H100)
- **Evaluation method**: Each experiment trained a 1.2B parameter proxy model, tested on 12 benchmarks

They explored along three main lines:

1. **Rewriting strategies**: Which format transformations actually work? Simple paraphrasing, Q&A pairs, step-by-step tutorials, structured tables...
2. **Generation models**: Is bigger always better? Do different model families matter? Are newer versions stronger?
3. **Data mixing ratios**: Does source data quality matter? Can synthetic data be used alone? What should it be mixed with?

The final output was **FinePhrase** — a synthetic pretraining dataset containing 486 billion tokens that achieved clear advantages across all baselines.

---

![Systematic Design Framework for 90 Experiments](https://i.see.you/2026/03/11/2Inw/20260311014309919.webp)

---

## III. Core Finding: Prompt Design Is the Biggest Lever

Among variables like model size, model family, and source data quality, **prompt design had by far the greatest impact**.

The research team tested existing prompts from projects like Nemotron, REWIRE, and BeyondWeb, and also designed 9 entirely new formats. Results showed that only four formats could consistently beat the strongest raw data baseline, DCLM:

| Winning Format | Core Feature |
|----------------|-------------|
| FAQ | Reorganizes content into Q&A pairs |
| Math | Converts into math word problems + solutions |
| Table | Extracts into structured tables |
| Tutorial | Rewrites as step-by-step tutorials |

Simple paraphrasing (Article), review-style summaries (Commentary), conversational format (Discussion), and narrative retelling (Narrative) all performed unremarkably.

The key difference: **The winning formats all restructured how knowledge is presented, rather than merely polishing the language**.

FAQ makes implicit questions explicit, Table aggregates scattered information into indexable units, and Tutorial externalizes procedural logic. These transformations force the model to convert implicit knowledge in the original document into structured, explicit representations.

In other words, the value of synthetic data isn't in "saying the same thing with better wording" — it's in **reshaping information into "curriculum formats" better suited for model learning**.

---

## IV. Counter-Intuitive Finding: A 1B Small Model Is Enough

The industry previously held a popular assumption: generating high-quality synthetic data requires 70B or even larger models. The REWIRE project used Llama-3.3 70B.

HuggingFace's experimental results directly refuted this assumption.

They compared the entire Gemma-3 series from 270M to 27B, and concluded:

- **Simple prompts**: 1B parameters suffice — no significant difference between 1B and 27B
- **Complex prompts** (like REWIRE's guided rewriting): 4B needed, but no difference between 4B and 27B
- **Low-quality source data**: Larger models don't help "rescue" it either

On the cost-efficiency Pareto frontier, the **small model + structured prompt** combination dominated. A 27B model costs 5-10x more GPU resources than a 1B model, with zero improvement in generation quality.

Furthermore, in a horizontal comparison of all 1B-class models, **SmolLM2-1.7B crushed all competitors** — including Qwen3, Gemma-3, Llama-3.2, Granite3, and Falcon3. And SmolLM2 is already a model released over a year ago.

The practical implication is very direct: **Use the cheapest model, and invest all the savings into data volume.**

---

![1B Small Model Beats 27B Large Model: Parameter Count Isn't the Deciding Factor](https://i.see.you/2026/03/11/wBv1/20260311014609964.webp)

---

## V. The Most Counter-Intuitive Finding: "Worse" Output Is Actually Better

This is probably the most surprising conclusion in the entire study.

The research team compared the output quality of SmolLM2 and Qwen3 when generating math problems:

| Metric | SmolLM2 | Qwen3 |
|--------|---------|-------|
| Complete solution rate | 68% | 100% |
| Output length range | 4-4000 tokens | 100-2600 tokens |
| Format consistency | Messy | Perfect (with LaTeX) |
| Most common opening repetition rate | 3/1000 | 115/1000 |

From a human aesthetic standpoint, Qwen3's output is impeccable. But the downstream models trained on SmolLM2's data **actually performed better**.

The reason is **Template Collapse**.

Qwen3 is too "obedient" — its outputs are highly homogeneous. Out of 1000 samples, 115 had identical openings. This uniformity looks like "standards" to humans, but it's a disaster for pretraining data. SmolLM2, though "sloppy," maintained extremely high text diversity.

This reveals a core paradox of pretraining data: **What humans prefer as "neat" may not be what models need for "generalizability"**.

For pretraining, diversity matters far more than consistency. A model that is "less obedient" can actually produce better training data.

---

## VI. Capability Trade-offs: Synthetic Data "Trades Common Sense for Knowledge"

Analyzing experiment results benchmark by benchmark, a consistent pattern emerged:

- Nearly all synthetic data significantly outperformed raw data on ARC (scientific knowledge), SQuAD (reading comprehension), and DROP (numerical reasoning)
- But nearly all synthetic data underperformed raw data on HellaSwag and PIQA (common sense reasoning)

The macro scores appear roughly even, but the gains and losses offset each other.

Synthetic data, through structured rewriting, makes the factual knowledge in web pages "explicit," making it easier for models to learn retrievable information. But this process simultaneously strips away the common sense, contextual cues, and implicit rules about how the world works that exist in raw web text.

**Synthetic data is essentially "trading common sense for knowledge."**

This explains another key finding: **Training on pure synthetic data is always worse than mixed training**. Synthetic data must be blended with high-quality raw data to maintain capability balance.

Moreover, what you mix in matters critically:

- **High-quality source data** → Mix in DCLM (to recover common sense signals)
- **Low-quality source data** → Mix in FineWeb-Edu-HQ (to supplement knowledge signals)

An important finding from the team: **The choice of mix-in dataset is sometimes more important than the source data itself**. As long as the mix-in data is strong enough, even rewriting low-quality web pages can approach the effectiveness of rewriting high-quality data. This vastly expands the usable data pool.

---

![Synthetic Data's Capability Trade-off: Trading Common Sense for Knowledge](https://i.see.you/2026/03/11/Pd7r/20260311014802775.webp)

---

## VII. Quality Scores Completely Fail on Synthetic Data

FineWeb-Edu-score and DCLM-score are commonly used metrics for filtering high-quality web pages. But when applied to evaluate synthetic data, **their predictive power drops to nearly zero**.

The DCLM-score's correlation with downstream performance was only 0.56-0.61 (moderate), while the Edu-score's correlation was a mere -0.08 (essentially uncorrelated).

Even more ironic: Edu-score actually **penalizes** format transformations that improved performance. When text was converted into tables, FAQs, or mathematical notation, the Edu-score judged "quality decreased" — yet these were precisely the best-performing formats.

The reason: these scorers were trained on "natural web text" and favor coherent long-form narratives. Structured formats appear as "anomalies" to them, even though they are "optimal" for model learning.

**The conclusion is harsh: there are no shortcuts. You must complete the full "generate → train → evaluate" pipeline to know the true quality of synthetic data.**

---

## VIII. The Cost Revolution at the Engineering Level

Cost is another core issue in synthetic data generation.

The REWIRE project used a 70B model to generate 400 billion tokens, requiring an estimated ~350,000 GPU hours. HuggingFace's FinePhrase used a 1.7B model to generate 486 billion tokens in only ~14,700 GPU hours.

Efficiency comparison:

| Project | Generation Model | Token Volume | GPU Hours | Efficiency (tokens/GPU hour) |
|---------|-----------------|-------------|-----------|------------------------------|
| Cosmopedia | Mixtral 8x7B | 25B | >10K | <2.5M |
| REWIRE | Llama-3.3 70B | 400B | ~352K | ~1.1M |
| FinePhrase | SmolLM2-1.7B | 486B | ~14.7K | ~33.1M |

FinePhrase's generation efficiency is approximately 30x that of REWIRE and 13x that of Cosmopedia.

Key optimizations included:

- **Speculative Decoding**: Extremely effective for small models — SmolLM2 achieved a 1.75x speedup
- **Tensor Parallelism Optimization**: Frees KV cache space for large MoE models
- **Flash-Attn Backend**: Over 50% faster than FlashInfer (on H100)

This means synthetic data production has gone from being "an exclusive game for compute giants" to **an engineering practice accessible to small and mid-sized teams**.

---

![FinePhrase's Cost Advantage: 30x Efficiency Improvement](https://i.see.you/2026/03/11/Brv0/20260311015008064.webp)

---

## IX. Clarification on "Model Collapse"

Academia frequently warns that AI training on its own generated data leads to "Model Collapse."

HuggingFace directly addressed this concern at the beginning of their paper: **This collapse only occurs under extremely closed experimental conditions** — where a model iteratively trains on its own output without introducing any new information.

Real-world industrial practice is entirely different:

- Synthetic data is mixed with human data
- Prompts reference diverse reference materials
- Synthetic data is a strategic supplement, not a wholesale replacement

In their FineWeb research, the team even found that naturally occurring AI-generated content on the web **did not cause model degradation**.

The real concern isn't ordinary synthetic data practices, but rather **the extreme scenario where frontier models generate data for other frontier models in a closed loop**. Synthetic data that is thoughtfully integrated with fresh perspectives isn't the problem — it's the solution.

---

## X. The Practical Recipe: FinePhrase's Final Configuration

Based on systematic validation across 90 experiments, HuggingFace delivered a concise best-practice recipe:

**Generation model**: SmolLM2-1.7B-Instruct
**Prompt format**: FAQ, Math, Table, Tutorial (pick one or mix)
**Source data**: FineWeb-Edu (relaxed quality requirements)
**Mix-in data**: DCLM or FineWeb-Edu-HQ
**Inference optimization**: suffix-32 speculative decoding + 0.9 memory utilization

The core logic of this recipe:

1. **Use structured prompts to reshape knowledge formats** — this is the biggest lever
2. **Use the smallest adequate model** — invest savings into data volume
3. **Use strong mix-in data as a safety net** — recover common sense signals, relax source data requirements
4. **Use engineering optimizations to compress costs** — make synthetic data production sustainable

---

![FinePhrase Final Recipe: Structured Prompts + Small Model + Strong Mix-in Data](https://i.see.you/2026/03/11/Qu2k/20260311015222443.webp)

---

## XI. Unanswered Questions

HuggingFace candidly listed the boundaries and open questions of this research:

- **Repetition and rewriting**: If data is rewritten each time it's repeated, can performance degradation be avoided?
- **Mixing ratios**: What proportion of synthetic data is optimal? 5%, 20%, or 50%?
- **Sampling strategies**: Is Best-of-N filtering effective?
- **Scale effects**: Do these findings hold at 100B+ token training scales?
- **Automated optimization**: Can tools like DSPy be used to automatically search for optimal prompts?

These questions define the agenda for the next phase of synthetic data research.

---

## Conclusion: From "Alchemy" to "Chemistry"

The fundamental contribution of this research isn't releasing yet another larger dataset — it's **transforming synthetic pretraining data generation from experience-driven trial-and-error into a verifiable, reproducible systematic methodology**.

Several core conclusions deserve repeated emphasis:

1. **Prompt design is the primary productivity driver** — restructure formats, don't polish language
2. **Small models are good enough** — 1B-class suffices; don't worship parameter counts
3. **Diversity beats consistency** — "obedient" models may actually produce worse data
4. **Raw data must be mixed in** — synthetic data "trades common sense for knowledge"
5. **Quality scores are unreliable** — you must complete the full train-evaluate pipeline

Synthetic data is evolving from an "optional data augmentation trick" to a "core production step in LLM training." And this research provides the clearest industrial-grade operating guide to date.

---

![From "Alchemy" to "Chemistry": Synthetic Data Goes Industrial](https://i.see.you/2026/03/11/Nng7/20260311015437646.webp)

---

*References*:

- [The Synthetic Data Playbook: Generating Trillions of the Finest Tokens](https://huggingface.co/spaces/HuggingFaceFW/finephrase)
