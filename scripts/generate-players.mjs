// 一次性数据生成脚本：生成 src/data/players.json
// 运行：node scripts/generate-players.mjs
// 说明：生成后即为纯数据文件，后续由用户手工替换为真实群友数据。
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const MAPS = ['炼狱小镇', '荒漠迷城', '远古遗迹', '核子危机', '死亡游乐园', '阿努比斯', '殒命大厦']
const RESULTS = ['win', 'lose', 'draw']

// 简单可复现的伪随机
let seed = 20260718
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}
const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min
const rf = (min, max, digits = 2) => Number((rand() * (max - min) + min).toFixed(digits))
const pick = (arr) => arr[Math.floor(rand() * arr.length)]

const MAIN_PLAYERS = [
  { id: 'player_01', name: '老杨', displayName: 'Yang', title: '破阵先锋', position: '先锋 · Entry', role: { primary: '突破手', secondary: ['步枪手'] }, motto: '先登陷阵，死战不退。', weapons: ['AK-47', 'AWP'], battleAge: '5年', joinDate: '2021-03', stars: 5, featured: true, level: 'gold' },
  { id: 'player_02', name: '阿凯', displayName: 'Kai', title: '中军主狙', position: '中军 · AWP', role: { primary: '狙击手', secondary: ['补枪手'] }, motto: '一枪既出，必有所获。', weapons: ['AWP', 'Deagle'], battleAge: '4年', joinDate: '2022-01', stars: 5, featured: true, level: 'gold' },
  { id: 'player_03', name: '北冥', displayName: 'Beiming', title: '帷幄军师', position: '军师 · IGL', role: { primary: '指挥', secondary: ['辅助位'] }, motto: '运筹帷幄之中，决胜千里之外。', weapons: ['M4A1-S', 'USP-S'], battleAge: '6年', joinDate: '2020-09', stars: 4, featured: true, level: 'gold' },
  { id: 'player_04', name: '疾风', displayName: 'Jifeng', title: '游骑劫营', position: '游骑 · Lurker', role: { primary: '自由人', secondary: ['断后'] }, motto: '其疾如风，侵掠如火。', weapons: ['M4A4', 'MP9'], battleAge: '3年', joinDate: '2023-02', stars: 4, featured: true, level: 'gold' },
  { id: 'player_05', name: '石头', displayName: 'Shitou', title: '铁壁卫营', position: '卫营 · Anchor', role: { primary: '主区防守', secondary: ['支援'] }, motto: '不动如山，难知如阴。', weapons: ['M4A1-S', 'Five-Seven'], battleAge: '4年', joinDate: '2022-06', stars: 4, featured: true, level: 'gold' },
]

const BENCH_PLAYERS = [
  { id: 'player_06', name: '惊雷', displayName: 'Jinglei', title: '偏将', position: '偏将 · 替补突破', role: { primary: '替补突破手', secondary: ['步枪手'] }, motto: '闻雷而动，一击即中。', weapons: ['AK-47', 'Galil AR'], battleAge: '2年', joinDate: '2024-01', stars: 3, featured: false, level: 'bronze' },
  { id: 'player_07', name: '长弓', displayName: 'Changgong', title: '游击射手', position: '游击 · 替补狙击', role: { primary: '替补狙击手', secondary: ['补枪'] }, motto: '挽弓当挽强。', weapons: ['AWP', 'SSG 08'], battleAge: '2年', joinDate: '2024-03', stars: 3, featured: false, level: 'bronze' },
  { id: 'player_08', name: '青锋', displayName: 'Qingfeng', title: '裨将', position: '裨将 · 万能替补', role: { primary: '全能替补', secondary: ['道具位'] }, motto: '青锋所指，寸草不生。', weapons: ['M4A4', 'P90'], battleAge: '1年', joinDate: '2024-11', stars: 3, featured: false, level: 'bronze' },
  { id: 'player_09', name: '墨羽', displayName: 'Moyu', title: '军候', position: '军候 · 数据分析', role: { primary: '数据分析', secondary: ['替补辅助'] }, motto: '料敌于先，谋定后动。', weapons: ['FAMAS', 'UMP-45'], battleAge: '3年', joinDate: '2023-08', stars: 3, featured: false, level: 'bronze' },
  { id: 'player_10', name: '虎牙', displayName: 'Huya', title: '新锐先锋', position: '新锐 · 青训', role: { primary: '青训队员', secondary: ['突破手'] }, motto: '少年负壮气，奋烈自有时。', weapons: ['AK-47', 'MAC-10'], battleAge: '1年', joinDate: '2025-05', stars: 2, featured: false, level: 'bronze' },
]

const BADGE_POOL = {
  player_01: [
    { id: 'b1', name: '残局鬼才', description: '单赛季残局 1vX 获胜超过 30 次', level: 'gold' },
    { id: 'b2', name: '先登死士', description: '首杀尝试率与首杀成功率双项全队第一', level: 'gold' },
    { id: 'b3', name: '百步穿杨', description: '单局爆头率超过 70%', level: 'silver' },
  ],
  player_02: [
    { id: 'b1', name: '辕门射戟', description: 'AWP 单局五杀救主', level: 'gold' },
    { id: 'b2', name: '神射无双', description: '狙击击杀占比超过 60%', level: 'silver' },
  ],
  player_03: [
    { id: 'b1', name: '算无遗策', description: '指挥回合胜率全队最高', level: 'gold' },
    { id: 'b2', name: '军心所系', description: '连续 50 场出战零缺席', level: 'silver' },
  ],
  player_04: [
    { id: 'b1', name: '神出鬼没', description: '单局绕后三杀扭转战局', level: 'gold' },
    { id: 'b2', name: '疾行无影', description: '场均移动距离全队第一', level: 'bronze' },
  ],
  player_05: [
    { id: 'b1', name: '铜墙铁壁', description: '单局主区防守零失分', level: 'gold' },
    { id: 'b2', name: '稳如泰山', description: 'KAST 连续 20 场超过 75%', level: 'silver' },
  ],
}

const DEFAULT_BADGES = (i) => [
  { id: 'b1', name: '闻鼓而进', description: '随队出战满 30 场', level: 'bronze' },
  { id: 'b2', name: '厉兵秣马', description: '单周训练时长超过 15 小时', level: 'bronze' },
]

const PLATFORM_NAMES = { official: '官匹 CS2', wanmei: '完美世界', fiveE: '5E竞技' }
const PLATFORM_RANKS = {
  official: ['全球精英', '无上之首席大师', '大师级守卫', '传奇之鹰', '黄金新星'],
  wanmei: ['S+', 'S', 'A+', 'A', 'B+'],
  fiveE: ['S', 'A+', 'A', 'B+', 'B'],
}

function genMatches(count, skill) {
  const matches = []
  let month = 6, day = 28
  for (let i = 0; i < count; i++) {
    const result = RESULTS[ri(0, 99) < skill * 100 ? 0 : ri(0, 99) < 75 ? 1 : 2]
    const myScore = result === 'win' ? 13 : result === 'lose' ? ri(4, 10) : 13
    const enemyScore = result === 'win' ? ri(4, 11) : result === 'lose' ? 13 : 13
    // 平局特殊处理
    const score = result === 'draw' ? '12-12' : `${myScore}-${enemyScore}`
    const kill = ri(10, 28)
    const death = ri(8, 20)
    const assist = ri(2, 9)
    matches.push({
      id: `m_${i + 1}`,
      date: `2026-0${month}-${String(day).padStart(2, '0')}`,
      map: pick(MAPS),
      enemy: pick(['雷霆战队', '玄武堂', '江东水师', '燕云十八骑', '烈焰军', '寒鸦小队']),
      result,
      score,
      kda: { kill, death, assist },
      rating: rf(0.8, 1.5),
      mvp: kill >= 22,
    })
    day -= ri(3, 7)
    if (day < 1) { month -= 1; day = ri(20, 28) }
    if (month < 1) { month = 1; day = Math.max(day, 2) }
  }
  return matches
}

function genPlatform(key, skill, enabled = true) {
  const rating = rf(0.95, 1.35)
  return {
    name: PLATFORM_NAMES[key],
    enabled,
    rank: pick(PLATFORM_RANKS[key]),
    stats: {
      rating,
      adr: rf(68, 95, 1),
      kast: `${rf(68, 82, 1)}%`,
      entry: `${rf(12, 28, 1)}%`,
      hs: `${rf(38, 62, 1)}%`,
    },
    radar: [
      { subject: '统帅', value: ri(70, 145), fullMark: 150 },
      { subject: '杀伤', value: ri(75, 148), fullMark: 150 },
      { subject: '存活', value: ri(60, 140), fullMark: 150 },
      { subject: '破阵', value: ri(65, 146), fullMark: 150 },
      { subject: '神射', value: ri(60, 144), fullMark: 150 },
    ],
    matches: genMatches(ri(3, 5), skill),
  }
}

function genPlayer(base, type) {
  const skill = type === 'main' ? rf(0.55, 0.8) : rf(0.4, 0.6)
  return {
    id: base.id,
    type,
    status: 'active',
    profile: {
      name: base.name,
      avatar: '',
      steamId64: `7656119${ri(800000000, 999999999)}`,
      role: base.role,
      title: base.title,
      motto: base.motto,
      joinDate: base.joinDate,
      weapons: base.weapons,
      battleAge: base.battleAge,
    },
    homepage: {
      displayName: base.displayName,
      position: base.position,
      shortDescription: type === 'main' ? `${base.title}，${base.role.primary}出身，${base.motto}` : `${base.title}，候命听调，${base.motto}`,
      featured: base.featured,
      stars: base.stars,
    },
    badges: BADGE_POOL[base.id] || DEFAULT_BADGES(),
    platforms: {
      official: genPlatform('official', skill),
      wanmei: genPlatform('wanmei', skill),
      fiveE: genPlatform('fiveE', skill),
    },
    highlights: [
      {
        id: 'h1',
        title: `${base.name} · 高光集锦第一卷`,
        description: `${base.title}近期征战精选，刀光剑影尽在此卷。`,
        platform: 'bilibili',
        bvid: 'BV1GJ411x7h7',
        cover: '',
      },
    ],
    career: {
      honors: base.featured
        ? [
            { id: 'hn1', name: '群内冠军杯 · 冠军', year: '2025' },
            { id: 'hn2', name: '周末水友赛 · MVP', year: '2026' },
          ]
        : [{ id: 'hn1', name: '群内冠军杯 · 殿军', year: '2025' }],
      history: [
        { year: base.joinDate.slice(0, 4), event: '投身杨门', achievement: `${base.title}之位` },
        { year: String(Number(base.joinDate.slice(0, 4)) + 1), event: '群内冠军杯', achievement: base.featured ? '力克群雄，夺魁' : '随队出征，名列前四' },
      ],
    },
  }
}

const data = {
  team: {
    id: 'yang_family_warlords',
    name: '杨门虎将',
    englishName: 'YANG FAMILY WARLORDS',
    motto: '百战黄沙，铁血铸魂',
    description: '五人一阵，破万军之敌',
  },
  enums: {
    playerTypes: { main: '先锋五虎', bench: '偏将与游击' },
    battleResults: { win: '大捷', lose: '惜败', draw: '鏖战' },
    platforms: { official: '官匹 CS2', wanmei: '完美世界', fiveE: '5E竞技' },
  },
  players: [
    ...MAIN_PLAYERS.map((p) => genPlayer(p, 'main')),
    ...BENCH_PLAYERS.map((p) => genPlayer(p, 'bench')),
  ],
}

const out = 'src/data/players.json'
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(data, null, 2), 'utf-8')
console.log(`generated ${out}: ${data.players.length} players`)
