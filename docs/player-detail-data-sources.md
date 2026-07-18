# /player 列传页 · 配置项 vs 接口读取项清单

> 列出 `/player/:id` 页面每个展示内容的数据来源。
> 页面本身不直接请求任何接口，全部读 `src/data/players.json`；
> 「接口读取」指该字段由 `scripts/stats/` 抓取工具自动更新，
> 「配置」指需要人工在 players.json（或 build-players.mjs 的人设区）维护。

## 一、接口读取（跑抓取脚本自动更新）

| 页面位置 | 展示内容 | players.json 字段 | 来源接口 |
|---|---|---|---|
| 名将画像 | 头像 | `profile.avatar` | Steam miniprofile（失败回退完美头像） |
| 卡片/档案小字 | Steam 昵称 | `profile.steamName` / `homepage.displayName` | Steam miniprofile |
| 官匹页签 | Rating/ADR/RWS/胜率/KAST/首杀率/爆头率/总场次/时长 | `platforms.official.stats` | 完美 `detailStats` |
| 官匹页签 | 官匹优先分数 | `platforms.official.rank` | 完美 `detailStats` 的 `rank` 字段 |
| 完美页签 | Rating/ADR/RWS/胜率/首杀率/爆头率/MVP次数/天梯分/赛季 | `platforms.wanmei.stats` | 完美 `pvpDetailDataStats`（当前赛季） |
| 完美页签 | 天梯分数 | `platforms.wanmei.rank` | 同上（`pvpScore`） |
| 5E 页签 | Rating/ADR/RWS/KPR/胜率/生涯场次/角色定位 | `platforms.fiveE.stats` | 5E `gate.5eplay.com`（Playwright 抓取） |
| 5E 页签 | ELO / 未定级 | `platforms.fiveE.rank` | 同上 |
| 能力罗盘 | 六维战力值（统帅/杀伤/战功/常胜/位列/夺魁） | `platforms.*.radar` | **派生**：由上述接口数据归一化换算，无需手配 |
| 征战纪要 | 每场战报（地图/比分/K-D/单场Rating/MVP/ELO变化） | `platforms.fiveE.matches` | 5E `player_match` 接口（仅 5E 有） |
| 页签显隐 | 无账号/无数据的平台自动隐藏 | `platforms.*.enabled` | **派生**：生成脚本按抓取结果设置 |

## 二、配置项（人工维护，接口拿不到）

| 页面位置 | 展示内容 | players.json 字段 | 说明 |
|---|---|---|---|
| 名将档案 | 群友名 | `profile.name` | 配置（build-players.mjs 的 ROSTER） |
| 名将档案 | 军职称号（破阵先锋等） | `profile.title` | 人设配置 |
| 名将档案 | 定位（突破手/步枪手） | `profile.role` | 人设配置 |
| 名将档案 | 所属/战龄/入伍时间 | `profile.joinDate` / `battleAge` | 配置 |
| 名将档案 | 常用兵器 | `profile.weapons` | 配置 |
| 名将档案 | 座右铭 | `profile.motto` | 配置 |
| 将印标签墙 | 徽章名/获得条件/金银铜成色 | `badges[]` | 人设配置（接口拿不到 1vX 评定标准） |
| 卡片 | 一句话介绍 | `homepage.shortDescription` | 配置 |
| 战阵回放 | B 站视频 BV 号/标题 | `highlights[]` | 配置（当前是占位 BV，需换真实稿件） |
| 荣誉墙 | 荣誉/生涯年表 | `career.honors` / `career.history` | 配置 |
| 页签名称/战果文案 | 官匹 CS2/完美世界/5E竞技、大捷/惜败/鏖战 | `enums.*` | 配置 |

## 三、刷新方式

```bash
# 1. 抓五人数据（5E 部分会启动无头浏览器）
npm run fetch:stats -- --steamid <id> --5e <domain> --out scratch/pX.json
# 2. 重新生成 players.json（人设保留，战绩覆盖）
node scripts/stats/build-players.mjs
```

注意：重跑生成脚本只更新「接口读取」区字段；「配置」区字段继承自现有 players.json，不会被覆盖。
