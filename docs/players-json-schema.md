# players.json Schema 说明文档

> 本文档逐字段解释 `src/data/players.json` 的结构与含义。
> 每个字段的「来源判定」一栏留空，由你判断该数据应该是：**手动配置**、**从外部平台读取**（Steam / 完美世界 / 5E），还是**混合**（外部读取为主、允许手动覆盖）。
>
> 判定选项参考：`配置` / `Steam` / `完美` / `5E` / `配置+外部` / `派生`（由其他字段计算得出，无需配置也不用读）

---

## 0. 顶层结构

```json
{
  "team":    { ... },   // 战队信息（主页点将台 Banner）
  "enums":   { ... },   // 枚举字典（类型/战果/平台名的中文映射）
  "players": [ ... ]    // 选手数组，当前 10 人：5 main + 5 bench
}
```

---

## 1. team —— 战队信息

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `team.id` | string | 战队唯一标识 | 内部引用 |配置 |
| `team.name` | string | 战队中文名「杨门虎将」 | 导航栏 / Hero 大标题 / 页脚 | 配置|
| `team.englishName` | string | 英文名「YANG FAMILY WARLORDS」 | Hero 副标题 | 配置|
| `team.motto` | string | 宣言上联「百战黄沙，铁血铸魂」 | Hero 宣言区 | 配置|
| `team.description` | string | 宣言下联「五人一阵，破万军之敌」 | Hero 宣言区 |配置 |

---

## 2. enums —— 枚举字典

前端所有文案映射都从这里取，改文案不用动代码。

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `enums.playerTypes` | object | 选手分类：`main`→先锋五虎，`bench`→偏将与游击 | 主页两个分区标题 | 配置|
| `enums.battleResults` | object | 战果汉化：`win`→大捷，`lose`→惜败，`draw`→鏖战 | 征战纪要 / 铜牌翻转 | 配置 （后续可优化 比分差距大于X时为 大胜/大败）|
| `enums.platforms` | object | 平台名：`official`→官匹 CS2，`wanmei`→完美世界，`fiveE`→5E竞技 | 兵符 Tab | 配置|

> 注意：`enums.battleResults` 的 key（win/lose/draw）必须与 `matches[].result` 的值对应。如果将来从外部平台读战绩，外部返回的胜负值需要**归一化**成这三个 key。

---

## 3. players[] —— 选手

### 3.1 基础标识

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `id` | string | 选手唯一 ID，如 `player_01`，同时是列传页路由 `/player/:id` | 路由 / 组件 key | 后续传steamid|
| `type` | string | `main`（五虎）或 `bench`（偏将），对应 `enums.playerTypes` | 主页分区 | 配置|
| `status` | string | 在役状态，当前均为 `active`（预留：退役/离队展示） | 预留 |配置 |

### 3.2 profile —— 个人档案

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `profile.name` | string | 选手 ID / 昵称，如「老杨」 | 卡片名 / 列传页标题 / 印章首字 | 配置 （这个是我们内部互相叫的名字） |
| `profile.avatar` | string | 头像 URL，当前为空串 → 组件回退到首字印章头像 | 卡片画像 / 列传页画像 | steam|
| `profile.steamId64` | string | Steam 64 位 ID，如 `7656119946507191` | 列传页档案；也是调 Steam API 的钥匙 | steam|
| `profile.role.primary` | string | 主定位，如「突破手」 | 档案「军职」 | 配置|
| `profile.role.secondary` | string[] | 副定位，如 `["步枪手"]` | 档案「定位」 | 配置|
| `profile.title` | string | 古风称号，如「破阵先锋」 | 卡片军职 / 档案 | 配置|
| `profile.motto` | string | 座右铭 | 人物志 Modal / 列传页 | 配置|
| `profile.joinDate` | string | 加入时间，如 `2021-03` | 档案 | steam （读取steam购买cs2的时间） 或者配置|
| `profile.weapons` | string[] | 常用兵器，如 `["AK-47","M4A1-S"]` | 档案「常用兵器」 | 完美/5E |
| `profile.battleAge` | string | 战龄，如「5年」 | 档案「战龄」 | 这个按加入时间距今计算 |

> `avatar` 若填 Steam 头像 URL 即可替换首字占位头像；Steam 头像本身可通过 API 按 `steamId64` 获取。

### 3.3 homepage —— 主页展示位

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `homepage.displayName` | string | 主页卡片上显示的名字（可与 `profile.name` 不同） | 五虎卡片 / 偏将铜牌 | steam的昵称|
| `homepage.position` | string | 主页位置文案，如「先锋 · Entry」 | 卡片军职行 | 配置|
| `homepage.shortDescription` | string | 一句话介绍 | 卡片描述 | 配置|
| `homepage.featured` | bool | 是否主力推荐位 | 卡片排序/强调 | 配置|

### 3.4 badges[] —— 将印标签墙

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `badges[].id` | string | 徽章唯一 ID | 组件 key |配置 |
| `badges[].name` | string | 徽章名，如「残局鬼才」 | 兵符标签 | 配置|
| `badges[].description` | string | 获得条件，hover tooltip 显示 | 标签墙 tooltip |配置 |
| `badges[].level` | string | 成色：`gold` / `silver` / `bronze`，决定金属色调 | 标签墙配色 |配置 |

> 部分徽章理论上可由战绩**派生**（如「残局鬼才」= 1vX 胜场 > N），但外部平台一般不直接给 1vX 数据。

### 3.5 platforms —— 三平台战绩

每个选手固定三个 key：`official`（官匹 CS2）/ `wanmei`（完美世界）/ `fiveE`（5E竞技），结构相同。

#### 3.5.1 平台元信息

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `platforms.<key>.name` | string | 平台显示名 | 兵符 Tab 文字 | 配置|
| `platforms.<key>.enabled` | bool | 是否启用该平台的展示（false 则 Tab 置灰/隐藏） | Tab 开关 | 配置|
| `platforms.<key>.rank` | string | 当前段位，如「黄金新星」「A+」「B」 | Tab 下方段位展示 | 读取外部|

#### 3.5.2 stats —— 赛季数据

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `stats.rating` | number | Rating 2.0 / 平台评分 | 数据面板 + 雷达「统帅」 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `stats.adr` | number | 场均伤害 | 数据面板 + 雷达「杀伤」 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `stats.kast` | string | KAST 百分比（带 % 的字符串） | 数据面板 + 雷达「存活」 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `stats.entry` | string | 首杀/破点成功率（带 %） | 数据面板 + 雷达「破阵」 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `stats.hs` | string | 爆头率（带 %） | 数据面板 + 雷达「神射」 | 读取外部。这部分后续要根据不同的平台，取不同的值 |

> 注意：`kast/entry/hs` 目前是**字符串**（如 `"74.5%"`），外部读数时注意格式归一；`rating/adr` 是数字。

#### 3.5.3 radar[] —— 能力罗盘

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `radar[].subject` | string | 维度名：统帅/杀伤/存活/破阵/神射 | 雷达图轴 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `radar[].value` | number | 维度得分（0–150） | 雷达图 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `radar[].fullMark` | number | 满分刻度，固定 150 | 雷达图刻度 | 读取外部。这部分后续要根据不同的平台，取不同的值|

> `value` 本质上是 `stats` 五项的**归一化换算**（如 rating 1.14 → 124），属于「派生」候选：可以由 stats 自动算，不必单独维护。

#### 3.5.4 matches[] —— 征战纪要

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `matches[].id` | string | 比赛唯一 ID | 组件 key | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `matches[].date` | string | 日期 `YYYY-MM-DD` | 战报列表 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `matches[].map` | string | 地图中文名，如「炼狱小镇」 | 战报「战场」 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `matches[].enemy` | string | 对手队名 | 战报 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `matches[].result` | string | `win` / `lose` / `draw`（必须对应 enums.battleResults） | 战报「大捷/惜败/鏖战」 | |
| `matches[].score` | string | 比分，如 `"13-8"` | 战报 | 读取外部。这部分后续要根据不同的平台，取不同的值|
| `matches[].kda.kill` | number | 击杀 | 战报「斩获」 | 读取外部|
| `matches[].kda.death` | number | 死亡 | 战报「斩获」 | 读取外部|
| `matches[].kda.assist` | number | 助攻 | 战报「斩获」 | 读取外部|
| `matches[].rating` | number | 单场 Rating | 战报 | 读取外部|
| `matches[].mvp` | bool | 是否本场 MVP | 战报 MVP 标记 |读取外部 |

> 偏将铜牌翻转的「最近出战/战绩」取的是该平台 matches 的第一场（即最近一场），所以 matches 数组需**按时间倒序**排列。

### 3.6 highlights[] —— 战阵回放

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `highlights[].id` | string | 视频唯一 ID | 组件 key | 配置|
| `highlights[].title` | string | 视频标题 | 回放区标题 | 配置|
| `highlights[].description` | string | 视频描述 | 回放区副文 | 配置|
| `highlights[].platform` | string | 平台，当前固定 `bilibili` | 播放器选择 | 配置|
| `highlights[].bvid` | string | B 站 BV 号（当前为占位，需换真实稿件） | iframe 播放器 |配置 |
| `highlights[].cover` | string | 封面图 URL，当前为空 | 预留 |配置 |

### 3.7 career —— 军旅生涯

| 字段 | 类型 | 含义 | 页面用途 | 来源判定 |
|---|---|---|---|---|
| `career.honors[].id` | string | 荣誉 ID | 组件 key | 配置|
| `career.honors[].name` | string | 荣誉名，如「群内冠军杯 · 冠军」 | 主页荣誉墙 | 配置|
| `career.honors[].year` | string | 获得年份 | 荣誉墙 | 配置|
| `career.history[].year` | string | 年份 | 生涯年表（预留展示） | 配置|
| `career.history[].event` | string | 事件，如「投身杨门」 | 生涯年表 | 配置|
| `career.history[].achievement` | string | 成就，如「破阵先锋之位」 | 生涯年表 | 配置|

---

## 4. 外部平台数据可得性参考（供判定时对照）

| 平台 | 能拿到什么 | 限制 |
|---|---|---|
| **Steam Web API** | 昵称、头像（`GetPlayerSummaries`，凭 steamId64）、游戏时长、成就 | 需要 Steam API Key；**拿不到** CS2 官匹 Rating/ADR/比赛记录（CS2 不像 Dota 有开放战绩 API；`GetUserStatsForGame` 对 CS2 仅提供极有限的累计数据） |
| **完美世界竞技平台** | 段位、Rating、ADR、爆头率、比赛记录（网页端有数据接口） | 无官方开放 API，需用其网页/App 的非公开接口，需登录态，有风控；字段定义以其页面为准 |
| **5E 对战平台** | 段位分、Rating、ADR、比赛记录 | 同上，非官方接口，需登录态 |
| **Bilibili** | 视频标题/封面（公开 API，按 BV 号） | 无 |

> 结论预判（最终由你判定）：`profile` 的昵称/头像可从 Steam 读；三平台的 `rank`/`stats`/`matches` 理论上能从各自平台读，但都是非官方接口，工程上有登录态和稳定性成本；称号、座右铭、徽章、荣誉这类「人设数据」只能手动配置。
