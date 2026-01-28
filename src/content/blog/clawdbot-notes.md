---
title: '🦞 Clawdbot → Moltbot：一场72小时的互联网闹剧'
description: '60000星开源项目被迫改名、10秒内被加密骗子抢注、1600万美元假代币崩盘——这场72小时的互联网风暴，暴露了AI时代开源生态的脆弱与荒诞'
pubDate: 'Jan 28 2026'
slug: 'clawdbot-moltbot-rename-drama'
draft: false
---

# 🦞 Clawdbot → Moltbot：一场72小时的互联网闹剧

## 第一章：一夜爆红的开源明星

**2026年1月26日**，一个名为 **Clawdbot** 的开源项目突然爆红。

![Moltbot Logo](https://kimi-web-img.moonshot.cn/img/linux.do/81c597191be3bfce2b07b0a3a5d8fec972e5511a.png)

由奥地利开发者 **Peter Steinberger**（@steipete）创建，Clawdbot 是一个自托管的 AI 助手，可以：

- 在 WhatsApp、Telegram、Discord、Slack、Signal、iMessage 上运行
- 拥有持久记忆，记住用户的偏好和对话历史
- 控制浏览器、执行 shell 命令、管理日历
- 主动发送通知和提醒

Steinberger 并非无名之辈——他是 PSPDFKit（现更名为 Nutrient）的创始人，2021年获得 Insight Partners 过亿美元投资后“退休”，如今重出江湖打造这个“带手的 Claude”。

**它的增长速度堪称疯狂：**

- 🚀 24小时内：**9,000+ GitHub stars**
- 🚀 72小时内：**60,000+ GitHub stars**
- 🚀 成为 GitHub 历史上增长最快的开源项目之一

Andrej Karpathy（前特斯拉 AI 总监）公开称赞它，David Sacks（PayPal Mafia 成员）发推讨论它，MacStories 称它为“个人 AI 助手的未来”。

---

## 第二章：Anthropic 的"商标炸弹"

**2026年1月27日**，就在 Clawdbot 爆红的巅峰时刻，**Anthropic**（Claude 的母公司）发出了商标相关请求。

![Anthropic Claude Logo](https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/2551b26ed53e3c284329af5a426c7234c23a990a.png)

**问题？** Anthropic 认为 **“Clawd”** 与 **“Claude”** 太过相似，涉嫌商标侵权。

创始人 Peter Steinberger 在 X 上宣布：

> 🦞 **BIG NEWS: We've molted!**
> 
> **Clawdbot → Moltbot**
> **Clawd → Molty**
> 
> *Same lobster soul, new shell.*
> 
> Anthropic asked us to change our name (trademark stuff), and honestly? “Molt” fits perfectly — it's what lobsters do to grow.

这个重新品牌的创意颇具巧思：

- 龙虾通过蜕壳（molt）来成长
- 项目也在"蜕壳"后获得新生
- 新网站：**molt.bot**

---

## 第三章：10秒钟的灾难 💥

然而，改名过程演变成了一场**灾难**。

Peter Steinberger 试图同时重命名 GitHub 组织和 X/Twitter 账号。在旧名称释放和新名称注册之间的**短短10秒空隙**中，**加密货币骗子抢注了这两个账号**！

> *“Had to rename our accounts for trademark stuff and messed up the GitHub rename and the X rename got snatched by crypto shills. That went wonderful.”*
> — Peter Steinberger

骗子们显然一直在监控这个机会。他们瞬间抢占了：

- ❌ 原 @clawdbot X 账号
- ❌ 原 Clawdbot GitHub 组织

然后开始利用这些账号向**数万名不知情的粉丝**推送加密货币骗局。

---

## 第四章：1600万美元的假代币骗局

抢注账号只是开始。几小时内，**假的 $CLAWD 代币**在 Solana 区块链上横空出世。

![Crypto Scam](https://kimi-web-img.moonshot.cn/img/masterthecrypto.com/73db0ac52d91fa61f40fc34aec4d72f906cba3a7.jpg)

**骗局时间线：**

- 📈 假代币市值一度飙升至 **$16,000,000**
- 📉 Peter Steinberger 公开声明“永远不会发行代币”
- 📉 代币价格瞬间崩盘 **90%+**
- 💸 晚期买家被“割韭菜”，骗子卷走数百万美元

Peter 被迫发推警告：

> *“To all crypto folks: Please stop pinging me, stop harassing me. I will never do a coin. Any project that lists me as coin owner is a SCAM.”*

---

## 第五章：安全噩梦浮出水面

与此同时，安全研究人员发现了 Clawdbot/Moltbot 的**严重安全漏洞**。

**区块链安全公司 SlowMist 报告：**

> “Multiple unauthenticated instances are publicly accessible, and several code flaws may lead to credential theft and even remote code execution.”

**研究员 Jamieson O'Reilly 发现：**

- 使用 Shodan 搜索“Clawdbot Control”可以找到**数百个暴露的控制面板**
- 这些面板包含：**API 密钥、机器人令牌、OAuth 密钥、完整对话历史**
- 攻击者可以：**冒充用户发送消息、执行命令、窃取数据**

**演示攻击：**

Archestra AI CEO **Matvey Kukuy** 发送了一封带有提示注入的恶意邮件给暴露的 Moltbot 实例。AI 读取邮件后，相信了“合法指令”，将用户的**最近5封邮件转发给了攻击者地址**。

**整个过程只用了5分钟。**

---

## 第六章：社区 vs Anthropic

社区开始质疑 Anthropic 的决定。

**关键问题：**

1. Clawdbot 实际上**推动了 Claude 的使用量**——许多用户专门配置 Clawdbot 使用 Claude 作为底层模型
2. 这是一个**快速崛起的项目**，正在给 Anthropic 带来免费营销和 API 收入
3. 改名导致的混乱造成了**实际的安全灾难和经济损失**
4. “Clawd”与“Claude”的相似性显然是**playful（玩梗）**，而非恶意侵权

**DHH（Ruby on Rails 创始人）** 批评 Anthropic 的近期举动是“customer hostile”（对客户敌对）。

AWS Hero **AJ Stuyvenberg** 更为直接：“They're speedrunning the journey from forgivable startup to loathsome corporation before any exit!”

开发者们开始将目光转向 OpenAI 的 Codex CLI（Apache 2.0 许可证），质疑 Anthropic 是否正在成为他们不愿在其平台上构建的那种公司。

---

## 结局：多重战线上的战斗

Peter Steinberger 现在同时在应对：

| 战线 | 状态 |
|------|------|
| 🔄 恢复被劫持的 GitHub/X 账号 | 进行中 |
| 🛡️ 应对加密货币骗子骚扰 | 持续 |
| 👥 管理 8,900+ Discord 社区成员 | 活跃 |
| 🔒 修复安全漏洞 | 紧急 |
| 📢 重建品牌认知度 | 挑战重重 |

---

## 更深层的教训

**对开源构建者：**

你在企业平台上构建，面临着模糊的商标政策。一封法律函就能迫使你改名，进而暴露你遭受账号劫持、骗局和混乱的风险。

**对 AI 公司：**

你最热情的支持者是那些构建奇怪实验工具的独立开发者。向病毒式传播的开源项目发送法律通知——这些项目正在推动你的 API 使用——是一个值得深思的选择。

**对用户：**

自托管具有 root 权限的 AI 智能体既强大又危险。这些工具的安全模型仍然不成熟。不要将它们运行在主力机器上，不要赋予它们访问加密货币钱包的权限。使用专用硬件、隔离账号和严格的 IP 白名单。

---

## 🤔 写在最后：Anthropic 真的是“正义”的一方吗？

这已经不是 Anthropic 第一次激怒开发者社区了。

就在两周前（1月9日），Anthropic 突然封杀了所有通过第三方工具使用 Claude Pro/Max 订阅的用户——没有任何预警，没有迁移方案。那些已经将 Claude 深度集成到工作流中的开发者一夜之间被“背刺”。

现在又是 Clawdbot 事件。

一家标榜“AI 安全”和“负责任 AI”的公司，却在商标问题上对一个明显是善意玩梗、实际上在推动 Claude 生态的开源项目下手。讽刺的是：

- **Clawdbot 让更多人使用 Claude API** → Anthropic 赚更多钱
- **Clawdbot 展示了 Claude 的能力** → 免费的营销素材
- **Clawdbot 的开发者是 Claude 的忠实粉丝** → 社区布道者

结果呢？一封法律函，一场公关灾难，以及一群曾经热情的开发者开始认真考虑迁移到 OpenAI。

Anthropic 的 slogan 是“AI safety”，但他们似乎更擅长“developer hostility”。

当一家公司的法务部门比产品部门更活跃时，也许是时候问一句：**他们保护的到底是谁的安全？** 是用户的安全，还是自己的商标帝国？

开源社区的信任一旦失去，很难重建。Anthropic 或许应该重新思考：在 AI 这场马拉松中，真正的护城河是技术和生态，而不是法律函件。

---

**🔗 相关链接：**

- 新项目主页：[molt.bot](https://molt.bot)
- GitHub：[github.com/moltbot](https://github.com/moltbot)
- X 账号：[@moltbot](https://x.com/moltbot)

*这就是开源 AI 世界的现实：一夜爆红、法律威胁、加密货币骗局、安全漏洞——全部在72小时内发生。* 🦞💥