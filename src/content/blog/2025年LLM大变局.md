---
title: '2025年LLM大变局：Simon Willison年度总结深度解读'
description: 'Django联合创始人Simon Willison的2025年LLM年度总结解读：推理模型改变一切、Claude Code创造10亿美元ARR、中国开源模型霸榜、OpenAI失去领先地位、$200/月订阅成为新标准。一篇让你看清AI行业全貌的万字深度分析。'
pubDate: 'Jan 01 2026'
slug: 'simon-willison-2025-year-in-llms'
draft: false
---

# 2025年LLM大变局：Simon Willison年度总结深度解读

> **原文链接**: [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/) - Simon Willison
> 
> 本文基于Simon Willison的年度总结进行解读，向这位Django联合创始人、LLM领域最敏锐的观察者致敬。

---

## 写在前面：为什么你该认真读Simon Willison？

Simon Willison不是那种只会吹捧AI的布道者。他是Django框架的联合创始人，是“prompt injection”这个术语的定义者，是Python软件基金会的董事会成员。更重要的是——他是一个每天都在用LLM干活的开发者，2025年他用AI辅助构建了110个工具。

当这样一个人说出“2025年是XXX之年”时，值得认真听。

---

## 核心观点一：推理模型改变了一切

**Simon的判断**: 推理（Reasoning）不是让AI数草莓里有几个R，而是让AI学会**带着工具干活**。

> “The real unlock of reasoning was in driving tools. Reasoning models with access to tools can plan out multi-step tasks, execute on them and continue to reason about the results.”

**我的解读**:

2024年底o1发布时，大多数人的反应是：“哦，能做数学题了，跟我有什么关系？”这种想法大错特错。

推理模型的真正价值在于：
- **规划能力**: 能把复杂任务拆解成可执行的步骤
- **反思能力**: 执行后能检查结果，调整策略
- **工具协调**: 能同时调用搜索、代码执行、文件操作等多种工具

这意味着什么？意味着AI从“问答机器”进化成了“执行者”。

![推理模型工作流程](https://cdn.sa.net/2026/01/01/x4k1s3bDohnzfaS.webp)

---

## 核心观点二：Agent从“科幻”变成“实用”

**Simon年初的预测**: Agent不会发生。

**Simon年末的承认**: 我错了一半。

> “I didn't think agents would happen because I didn't think the gullibility problem could be solved... But if you define agents as LLM systems that can perform useful work via tool calls over multiple steps then agents are here.”

**我的解读**:

Simon的“打脸”其实很有启发性。他错在哪？错在把Agent想象成科幻电影里的万能助手。但真正落地的Agent是什么？是**Claude Code**，是**Codex CLI**，是能替你写代码、跑测试、提PR的工具。

关键洞察：
1. **Agent ≠ 通用智能助手**，而是**特定领域的自动化执行器**
2. **代码领域**成为Agent最成熟的落地场景，因为代码执行结果可验证
3. **搜索领域**是第二个成熟场景，深度研究模式真正work了

Simon给出了一个务实的Agent定义：**“能通过循环调用工具来达成目标的LLM系统”**。不玄乎，但管用。

---

## 核心观点三：Claude Code是2025年最重要的产品

**Simon的原话**: “The most impactful event of 2025 happened in February, with the quiet release of Claude Code.”

这个观点可能会让很多人意外。不是GPT-5？不是DeepSeek R1的股市冲击？是一个**命令行工具**？

**我的解读**:

Claude Code代表的是一种范式转变——**LLM从对话界面走向终端**。

为什么这很重要？

1. **开发者的自然栖息地**: 终端是开发者最熟悉的环境，管道、重定向、脚本组合——这些Unix哲学与LLM完美融合
2. **$10亿ARR的验证**: Anthropic宣布Claude Code达到10亿美元年收入。一个CLI工具！这说明专业用户愿意为真正有用的AI工具付费
3. **异步执行的突破**: Claude Code for web可以在后台运行，你发一个任务，去喝杯咖啡，回来PR就提好了

在经过净化处理的软件工程基准测试SWE-rebench中，Claude Code遥遥领先。Claude Code搭配上Claude Opus 4.5是最佳Vibe Coding组合。而在修Bug、审查代码等方面，OpenAI的Codex GPT 5.2 xhigh更擅长。

![Claude Code在SWE-rebench上遥遥领先](https://cdn.sa.net/2026/01/01/o1pJ3teDyciH9dZ.webp)

---

## 核心观点四：中国开源模型全面崛起

**Simon的数据**: Artificial Analysis排行榜上，前五名开源模型**全部来自中国**。

> “GLM-4.7, Kimi K2 Thinking, MiMo-V2-Flash, DeepSeek V3.2, MiniMax-M2.1 are all Chinese open weight models.”

![Artificial Analysis排行榜上，前五名开源模型全部来自中国](https://cdn.sa.net/2026/01/01/8JKmB1CFXaQvglc.webp)

**我的解读**:

DeepSeek R1在2025年1月20日发布，当天NVIDIA市值蒸发6000亿美元。这不是技术事件，这是地缘政治事件。

几个关键事实：
1. DeepSeek V3训练成本约550万美元，而美国公司动辄几亿
2. 这些模型不只是“开源”，而是**真开源**——MIT或Apache 2.0许可证
3. 虽然训练代码和数据集未公开，但详细的技术论文推动了全行业进步

这对你意味着什么？
- 本地部署顶级模型的门槛大幅降低
- API成本的参照系被重新定义
- “AI是美国垄断”的叙事被打破

---

## 核心观点五：OpenAI失去了领先地位

**Simon的判断**: “This year the rest of the industry caught up.”

这不是说OpenAI变差了，而是：
- 图像生成被Google Nano Banana超越
- 代码能力被Claude Opus 4.5挑战
- 开源模型被中国厂商碾压
- 音频API被Gemini Live威胁

**我的解读**:

OpenAI的优势现在主要是**品牌认知**——“LLM没人知道，ChatGPT人人都听过”。但在专业开发者圈子，这种优势正在被稀释。

Google在12月发布Gemini 3后，OpenAI内部宣布了“Code Red”。这是OpenAI第一次公开承认感受到了竞争压力。

更深层的问题：Google有自己的TPU，不需要给NVIDIA交“GPU税”。当训练成本是核心竞争力时，这是结构性优势。

---

## 核心观点六：$200/月订阅成为新标准

**事实**: Claude Pro Max、ChatGPT Pro、Google AI Ultra都在$200/月档位。

**Simon的亲身体验**: “I've personally paid $100/month for Claude... I've heard from plenty of other people who are happy to pay these prices too.”

**我的解读**:

这揭示了一个分化：
- **普通用户**: 免费版或$20/月够用
- **重度用户**: $200/月是划算的交易

为什么划算？因为Coding Agent会**疯狂消耗token**。如果你每天都在用Claude Code处理复杂任务，按API计费可能远超$200。

这也意味着：**LLM正在从“新奇玩具”变成“专业工具”**。专业工具就该有专业定价。

---

## 核心观点七：YOLO模式与“偏差正常化”的危险

**Simon的警告**: “The longer we get away with running these systems in fundamentally insecure ways, the closer we are getting to a Challenger disaster of our own.”

**背景**: YOLO模式 = 让Coding Agent自动执行所有操作，不需要人工确认。

**我的解读**:

这是Simon在这篇文章中最严肃的警告。他引用了社会学家Diane Vaughan对挑战者号航天飞机灾难的研究——工程师早就知道O型环有问题，但因为多次发射没出事，风险被“正常化”了。

类比到AI：
- 你每天YOLO模式运行Claude Code都没出事
- 你开始觉得prompt injection只是理论风险
- 直到有一天，恶意指令真的删掉了你的home目录

Johann Rehberger把这叫做“**AI领域的偏差正常化**”。Simon显然深以为然。

---

## 核心观点八：MCP可能只是昙花一现

**Simon的观察**: “The reason I think MCP may be a one-year wonder is the stratospheric growth of coding agents.”

**核心论点**: 当Agent能运行任意Bash命令时，谁还需要MCP？

**我的解读**:

MCP（Model Context Protocol）是Anthropic在2024年11月推出的工具调用标准，2025年初爆火——OpenAI、Anthropic、Mistral八天内都宣布支持。

但Simon指出了一个尴尬的事实：**Bash是终极工具**。能跑shell命令的Agent，可以调用任何CLI工具——git、gh、ffmpeg、curl——何必再封装一层MCP？

Anthropic自己似乎也意识到了这一点，推出了更轻量的**Skills**机制：一个Markdown文件+可选脚本，比MCP的JSON-RPC服务器简单太多。

---

## 核心观点九：本地模型很好，但云端模型更好

**Simon的矛盾心态**:
> “I got small amounts of real work done offline! My excitement for local LLMs was very much rekindled.”

但同时：
> “I have yet to try a local model that handles Bash tool calls reliably enough for me to trust that model to operate a coding agent on my device.”

**我的解读**:

2025年本地模型确实进步巨大：
- Mistral Small 3（24B）≈ GPT-4水平，能在64GB笔记本上跑
- 20-32B参数区间成为甜点
- 离线也能做一些实际工作

但问题在于**可靠性**。Coding Agent需要模型稳定地调用工具几十甚至上百次。本地模型还做不到。

Simon的结论：下一台笔记本至少128GB内存，但主力工具仍是云端前沿模型。

---

## 核心观点十：“Slop”成为年度词汇

**Merriam-Webster的定义**：“通过人工智能大量生产的低质量数字内容”

**Simon的乐观倾向**:
> “The internet has always been flooded with low quality content. The challenge, as ever, is to find and amplify the good stuff.”

**我的解读**:

“Slop”（AI垃圾内容）这个词的流行，反映了公众对AI生成内容的警惕正在提升。这是好事。

但Simon提出了一个更深的问题：**你能感知到slop的影响吗？**

他自己的答案是：可能不能。因为他不用Facebook，精心策展自己的信息源。对于不这么做的普通用户呢？可能正在被slop淹没而不自知。

---

## 核心观点十一：数据中心正在变得极度不受欢迎

**事实**: 200多个环保组织要求暂停美国新数据中心建设。

**Simon的关注点**: 水资源问题可能被夸大（分散注意力），但能源消耗是**真实的**。

**我的解读**:

这是这篇文章中唯一涉及AI伦理/社会影响的部分，而且Simon的态度很谨慎。

他指出了**Jevons悖论**：每token成本下降→用户消耗更多token→总能耗不降反升。

$200/月的订阅用户可能比$20用户消耗10倍的计算资源。效率提升被使用量增长抵消。

---

## 我的总结：Simon Willison教会我们的思维方式

读完这篇13000字的年度总结，我学到的不只是26个趋势，而是一种**观察AI行业的方法论**：

1. **亲身实践**: Simon不是评论家，他构建了110个工具，每天都在用这些技术
2. **承认错误**: 他年初预测Agent不会发生，年末坦然承认错了一半
3. **定义术语**：“prompt injection”、“slop”、“lethal trifecta”——清晰的概念是清晰思考的前提
4. **关注安全**：即使天天用YOLO模式，也不忘警告“挑战者号灾难”的风险
5. **保持好奇**: 44岁的Django创始人，还在研究用手机编程

如果你想跟上LLM领域的发展，没有比关注Simon Willison更好的方式了。

---

## 附：Simon Willison创造/推广的2025年关键术语

| 术语 | 含义 |
|------|------|
| **Vibe Coding** | 完全依靠提示词让LLM生成代码，“忘记代码的存在” |
| **The Lethal Trifecta** | 致命三重奏：访问私有数据+对外通信能力+暴露于不可信内容 |
| **Context Rot** | 上下文腐烂：随着对话变长，模型输出质量下降 |
| **Slopsquatting** | 利用LLM幻觉出的错误包名注册恶意软件包 |
| **Asynchronous Coding Agent** | 异步Coding Agent：后台运行、完成后提PR的工具 |

---

> **原文**: [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)
> 
> 如果你觉得这篇解读有价值，去订阅Simon的博客：RSS、邮件或Bluesky/Mastodon都行。$10/月还能获得他的月度简报。

## 备注

本篇文章由作者和Claude Opus 4.5、Gemini 3 Pro合力完成。
