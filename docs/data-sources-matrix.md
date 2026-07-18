# 三平台数据可得性对照表

> 基于 2026-07-18 对真实账号的实测抓取（工具：`scripts/stats/`）。
> 数据源：官匹/完美 = wmpvp 公开接口（纯 HTTP）；5E = gate.5eplay.com（Playwright 拦截页面 API）。
> ✅ 可直接获取　🟡 可派生/部分获取　❌ 获取不到

## 1. 各平台字段清单（实测返回）

### 官匹 CS2（wmpvp `detailStats`）

rating、adr、kast、kd、winRate、rws、kills/deaths/assists（总）、cnt（场次）、
headShotRatio（爆头率）、entryKillRatio（首杀率）、entryKillAvg、
awpKillRatio、flashSuccessRatio（闪光成功率）、
k3/k4/k5（多杀次数）、vs3/vs4/vs5（残局次数）、endingWin（残局胜场）、multiKill、
honor1~6Count（点赞类荣誉）、hotMaps、hotWeapons、
historyRatings/historyRanks/historyRws/historyDates（历史序列）、
rank（官匹排名数）、nickName、avatar、friendCode（好友码）、hours（游戏时长）、
matchList（**字段存在，但该账号实测为空**，有官匹比赛的账号可能有数据）

### 完美世界（wmpvp `pvpDetailDataStats`，按赛季）

seasonId、name、avatar、
pvpScore（**天梯分数**，实测 1590）、scoreList（分数历史）、stars、
rating、pwRating、commonRating、hitRate、adr、rws、kd、winRate、
kills/deaths/assists、cnt、mvpCount（MVP 次数）、gameScore、
headShotRatio、entryKillRatio、
k2/k3/k4/k5、vs1~vs5、vs1WinRate、endingWin、multiKill、
**shot / victory / breach / snipe / prop（五维能力分：射击/胜率/突破/狙击/道具）**、
hotMaps、hotWeapons、historyRatings/historyPwRatings/historyRws/historyDates、
titles（称号，实测为空）、summary

### 5E（gate.5eplay.com 系列接口）

elo（天梯分，实测 1601.8）、level_id（段位等级）、rank（全服排名）、
match_total / match_win / match_tie / match_loss（生涯场次）、
win_streak（连胜）、best_season、match_time_total（游戏时长秒数）、
rating、rws、adr、kpr、
role / role_key（角色定位，如"清道夫·补枪手"）、各角色维度分（lurker_scores 等）、
season_list（赛季列表与时间）、chart/curve（每日 rating/adr 曲线）、chart/active（每日胜负）、
**player_match 比赛列表**：每场含 match_id、日期、地图（中文名）、比分、
kill/death（无助攻）、rating、rws、adr、is_mvp、is_svp、elo 变化、is_tie、
多杀次数（kill_1~5）、各类"全场之最"标记

## 2. 横向对照矩阵

| 数据项 | 官匹 | 完美 | 5E |
|---|:-:|:-:|:-:|
| 昵称 / 头像 | ✅ | ✅ | 🟡（头像接口偶发未捕获，需补） |
| Rating | ✅ | ✅（含 pwRating 双评分） | ✅ |
| ADR | ✅ | ✅ | ✅ |
| RWS | ✅ | ✅ | ✅ |
| KD / 击杀死亡总数 | ✅ | ✅ | 🟡（kpr + 逐场累计派生） |
| 胜率 / 场次 | ✅ | ✅ | ✅（含平局细分） |
| 段位 / 天梯分 | 🟡（rank 排名数，无段位名） | ✅（pvpScore 天梯分） | ✅（ELO + level_id） |
| KAST | ✅ | ❌ | ❌ |
| 爆头率 | ✅ | ✅ | ❌ |
| 首杀/破点率 | ✅ | ✅ | ❌ |
| MVP 次数 | 🟡（honor 字段含义待确认） | ✅ | ✅（逐场 is_mvp/is_svp） |
| 多杀次数 | ✅（k3~k5） | ✅（k2~k5） | 🟡（逐场派生） |
| 残局 1vX | ✅（vs3~5） | ✅（vs1~5 + 胜率） | 🟡（逐场派生） |
| 能力五维 | ❌ | ✅（射击/胜率/突破/狙击/道具） | ✅（角色维度分，体系不同） |
| **比赛列表** | 🟡（字段存在实测为空） | ❌ | ✅（最完整） |
| 游戏时长 | ✅（hours） | ❌ | ✅（match_time_total） |
| 角色定位 | ❌ | 🟡（titles 实测为空） | ✅（如"清道夫"） |
| 历史趋势序列 | ✅ | ✅ | ✅（chart 曲线） |
| 好友码 | ✅ | ❌ | ❌ |
| 抓取方式 | 纯 HTTP 免登录 | 纯 HTTP 免登录 | 需无头浏览器（签名 API） |

## 3. 结论

### 三家都能拿（可直接做跨平台对齐展示）

- **Rating、ADR、RWS、胜率/场次、段位/天梯分、MVP、昵称/头像**
- 这正好覆盖 `players.json` 里 `stats.rating / stats.adr / rank` 和战绩总览

### 只有部分平台能拿（展示时需降级或留空）

- **KAST**：只有官匹有 → 完美/5E 的雷达「存活」维度需要另找依据或留空
- **爆头率、首杀率**：官匹+完美有，5E 没有 → 5E 的「神射」「破阵」维度缺数据源
- **多杀 / 残局 1vX**：官匹+完美直接给总数，5E 需逐场累计派生
- **游戏时长**：官匹、5E 有，完美没有
- **能力五维**：完美和 5E 各有一套但**维度定义不同**（完美：射击/胜率/突破/狙击/道具；5E：角色体系分），不能直接混用；官匹没有五维

### 只有一个平台能拿（独有数据）

- **逐场比赛列表：只有 5E** → 网站「征战纪要」模块目前只有 5E 能自动供数据；官匹 matchList 字段存在但待有官匹比赛的账号验证；完美完全没有
- **角色定位（"清道夫"等）：只有 5E**
- **好友码：只有官匹**
- **历史分数序列 scoreList：只有完美**（天梯分走势图）

### 对 players.json 字段的直接影响

| 字段 | 判定建议 |
|---|---|
| `stats.rating / adr` | 三平台都可自动读取 |
| `stats.kast` | 仅官匹可读，完美/5E 需留空或改为手动配置 |
| `stats.entry / stats.hs` | 官匹/完美可读，5E 需留空 |
| `rank` | 完美（pvpScore）、5E（ELO+level）可读；官匹只有排名数 |
| `radar[]` | 无统一来源：完美有五维分（需归一化到 150 满分），官匹/5E 需按 stats 派生或手配 |
| `matches[]` | 仅 5E 可自动读取；官匹待验证；完美只能手动维护 |
| `profile.avatar / name` | 三平台均可读（5E 头像抓取需加固） |
