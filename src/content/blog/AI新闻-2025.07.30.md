---
title: 'AI新闻—2025.07.30'
description: '2025.7.30 AI新闻'
pubDate: 'Jul 30 2025'
slug: 'ai-news-1'
draft: false
---

## 开源

1. Qwen3-30B-A3B小更新

Qwen3-30B-A3B模型最近发布了小更新版本Qwen3-30B-A3B-Instruct-2507，这是一个高效的混合专家（MoE）模型，仅激活3B参数，却在非思考模式下达到了接近GPT-4o和Qwen3-235B-A22B的性能水平。主要改进包括：

- 增强了推理、编码和数学能力；
- 扩展了多语言知识覆盖；
- 提升了长上下文理解能力，支持高达256K tokens；
- 更好地对齐用户意图和处理开放式任务；
- 去除<think>块，使响应更直接高效。

该更新使模型更智能、更快速，并便于本地部署，适用于各种复杂任务，如指令跟随、逻辑推理和工具使用。

> 短评: 利好开源和做实验。

官方推文: https://x.com/Alibaba_Qwen/status/1950227114793586867

模型开源地址: https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507

## 闭源

1. ChatGPT Study Mode

OpenAI今日推出ChatGPT的“学习模式”（study mode），这是一个旨在帮助用户逐步解决问题而非直接提供答案的学习体验。该模式通过提问引导、逐步讲解和互动方式，提升用户的批判性思维和学习效果，特别适用于家庭作业帮助、考试准备和新知识探索。

目前，该功能已对免费版、Plus、Pro和Team的登录用户开放，ChatGPT Edu用户将在未来几周内可用。这一更新被视为AI在教育领域的负责任应用，旨在减少对生成式AI的依赖并促进深度学习。

![ChatGPT Study Mode体验](https://cdn.sa.net/2025/07/30/Glty2OPrNMJC3kD.webp)

> 短评: 普通用户体验最强的AI产品，ChatGPT教你学习，有时不禁思考是否还有学校存在的必要。

官方博文: https://openai.com/index/chatgpt-study-mode/

2. NotebookLM & AI Mode Updates

谷歌近日推出NotebookLM的重大更新，包括引入视频概述（Video Overviews）和工作室面板（Studio）的升级。

前者作为音频概述的视觉替代，通过AI生成叙述幻灯片，融入来源文档中的图像、图表、引用和数据，帮助用户更直观地理解复杂信息，并支持自定义主题、学习目标和受众；后者则采用全新界面设计，支持在单一笔记本中创建并存储多种相同类型输出（如多语言音频或针对不同章节的思维导图），提升协作和多任务效率。该功能已在英文用户中逐步 rollout，更多语言支持即将到来。

此外，针对开学季，Google Search的AI模式（AI Mode）也迎来更新，包括支持桌面浏览器上传图像和PDF文件（未来扩展至Google Drive等类型）、Canvas工具用于多会话规划（如创建学习指南）、集成Google Lens的Search Live实时视频输入，以及Chrome中的Lens功能允许询问屏幕内容。这些增强旨在通过互动提问、跨参考信息和视觉上下文，提升学生、家长和教育者的学习体验，目前主要在美国和印度可用，适用于18岁以上用户。

> 短评: Google的产品更新博文公布并不意味着功能立马获得，需要耐心等待，就如前一阵子AI Mode支持Gemini 2.5 Pro和Deep Research而言，当天博文发布时，用户们并没有第一时间获得该功能，后续才获取到了该功能。NotebookLM是学习的好帮手，更新的功能可进一步辅助学习；AI Mode是Google革自己命的预演，近期也有如Web Guide的实验项目，这些实验未来终将作为Google Search AI时代的产品发布。

官方博文: 

https://blog.google/technology/google-labs/notebooklm-video-overviews-studio-upgrades/

https://blog.google/products/search/ai-mode-updates-back-to-school/

3. Claude Code -add-dir命令

Claude Code最近引入了--add-dir命令，这是一个允许用户在单一会话中跨多个目录工作的功能扩展。通过在启动时使用CLI标志--add-dir <路径>或在会话中使用斜杠命令/add-dir <路径>，开发者可以无缝地将额外的工作目录添加到Claude Code的工作空间中，而无需切换主目录。该更新特别适用于处理单仓库（monorepo）、共享配置或跨项目协作的场景，帮助提升代码导航、引用和编辑的效率，使Claude Code作为终端AI编码工具更加强大和灵活。

> 短评: Claude Code目前已经成为了开发者群体最受欢迎的产品，跨目录功能的扩展进一步使其体验更上一层楼。Anthropic以用户需求开发产品这一点值得点赞。

官方推文: https://x.com/_catwu/status/1950288312033562751

## 备注

本篇文章由作者和Grok 4合力完成。