/**
 * 用抓取到的真实数据重建 src/data/players.json
 *
 * 输入：
 *   - scratch/p*.json        由 scripts/stats/index.mjs 抓取的原始数据
 *   - src/data/players.json  现有文件（保留人设字段与偏将数据）
 *
 * 人设字段（title/motto/role/weapons/badges/career/homepage）属于手动配置，
 * 从现有 players.json 的五虎身上继承；战绩字段全部由抓取数据重建。
 *
 * 用法：node scripts/stats/build-players.mjs
 */

import fs from 'node:fs';
import { fetchSteamProfile } from './steam.mjs';

// ─── 首发五人配置（顺序即五虎排序；人设按顺序继承自旧数据） ───
const ROSTER = [
  { id: 'player_01', name: '黑狼', steamid: '76561198253603000', fiveE: '15111866rusbyp', file: 'scratch/p1_heilang.json' },
  { id: 'player_02', name: '泓哥', steamid: '76561198178979757', fiveE: 'rushb_pfvo3e', file: 'scratch/p2_hongge.json' },
  { id: 'player_03', name: '杨梅', steamid: '76561199180228024', fiveE: '16687236gj9lqr', file: 'scratch/p3_yangmei.json' },
  { id: 'player_04', name: '升仔', steamid: '76561198840097603', fiveE: '1977_najdt1', file: 'scratch/p4_shengzai.json' },
  { id: 'player_05', name: '西柚', steamid: '76561198938139168', fiveE: 'rainweic', file: 'scratch/p5_xiyou.json' },
];

// ─── 将帅能力罗盘：统一六维，归一化到 0–150 ───
// 六维全部选用三平台都可获取的指标，各轴换算规则如下（满分即 150）
const clamp = (v, lo = 0, hi = 150) => Math.max(lo, Math.min(hi, Math.round(v)));
const pctStr = (v) => `${(+v).toFixed(1)}%`;

function buildRadar({ rating, adr, rws, winRate, ladderValue, ladderRaw, mvpValue, mvpRaw }) {
  return [
    { subject: '统帅', metric: 'Rating', value: rating != null ? clamp(rating * 100) : null, fullMark: 150, raw: rating ?? '——' }, // Rating 1.5 = 满分
    { subject: '杀伤', metric: 'ADR', value: adr != null ? clamp(adr * 1.25) : null, fullMark: 150, raw: adr ?? '——' }, // ADR 120 = 满分
    { subject: '战功', metric: 'RWS', value: rws != null ? clamp(rws * 10) : null, fullMark: 150, raw: rws ?? '——' }, // RWS 15 = 满分
    { subject: '常胜', metric: '胜率', value: winRate != null ? clamp(winRate * 150) : null, fullMark: 150, raw: winRate != null ? pctStr(winRate * 100) : '——' }, // 胜率 100% = 满分
    { subject: '位列', metric: '段位', value: ladderValue ?? null, fullMark: 150, raw: ladderRaw ?? '——' }, // 段位/天梯分，各平台口径见下
    { subject: '夺魁', metric: 'MVP', value: mvpValue ?? null, fullMark: 150, raw: mvpRaw ?? '——' }, // MVP 率 50% = 满分
  ];
}

// 段位轴换算：完美天梯分 / 5E ELO 按 3000 分满分；官匹优先综合得分按 30000 分满分
const ladderFromScore = (score, max = 3000) => (score > 0 ? clamp((score / max) * 150, 5) : null);
const mvpRate = (mvp, total) => (total > 0 && mvp != null ? clamp((mvp / total) * 300) : null);

// ─── 构建单个平台 ───
function buildOfficial(raw) {
  if (!raw || !(raw.cnt > 0)) return { name: '官匹 CS2', enabled: false, rank: '', stats: {}, radar: [], matches: [] };
  const stats = {
    rating: raw.rating ?? null,
    adr: raw.adr ?? null,
    rws: raw.rws ?? null,
    kast: raw.kast != null ? `${raw.kast}%` : '',
    entry: raw.entryKillRatio != null ? pctStr(raw.entryKillRatio * 100) : '',
    hs: raw.headShotRatio != null ? pctStr(raw.headShotRatio * 100) : '',
    winRate: raw.winRate != null ? pctStr(raw.winRate * 100) : '',
    matches: raw.cnt ?? null,
    hours: raw.hours ?? null,
    friendCode: raw.friendCode ?? '',
  };
  return {
    name: '官匹 CS2',
    enabled: true,
    rank: raw.rank > 0 ? `${raw.rank}` : '暂无数据', // 官匹优先综合得分
    stats,
    radar: buildRadar({
      rating: raw.rating, adr: raw.adr, rws: raw.rws, winRate: raw.winRate,
      ladderValue: ladderFromScore(raw.rank, 30000), ladderRaw: raw.rank > 0 ? `${raw.rank} 分` : '暂无',
      mvpValue: null, mvpRaw: null, // 官匹接口无 MVP 数据
    }),
    matches: [], // 官匹 matchList 字段存在但通常为空，暂无稳定来源
  };
}

function buildWanmei(raw) {
  if (!raw || !(raw.cnt > 0)) return { name: '完美世界', enabled: false, rank: '', stats: {}, radar: [], matches: [] };
  const stats = {
    rating: raw.rating ?? null,
    adr: raw.adr ?? null,
    rws: raw.rws ?? null,
    winRate: raw.winRate != null ? pctStr(raw.winRate * 100) : '',
    entry: raw.entryKillRatio != null ? pctStr(raw.entryKillRatio * 100) : '',
    hs: raw.headShotRatio != null ? pctStr(raw.headShotRatio * 100) : '',
    mvpCount: raw.mvpCount ?? null,
    pvpScore: raw.pvpScore ?? null,
    seasonId: raw.seasonId ?? '',
  };
  return {
    name: '完美世界',
    enabled: true,
    rank: raw.pvpScore > 0 ? `天梯 ${raw.pvpScore} 分` : '未定级',
    stats,
    radar: buildRadar({
      rating: raw.rating, adr: raw.adr, rws: raw.rws, winRate: raw.winRate,
      ladderValue: ladderFromScore(raw.pvpScore), ladderRaw: raw.pvpScore > 0 ? `${raw.pvpScore} 分` : '未定级',
      mvpValue: mvpRate(raw.mvpCount, raw.cnt), mvpRaw: raw.mvpCount != null ? `${raw.mvpCount} 次` : null,
    }),
    matches: [], // 完美无比赛列表接口，只能手动补录
  };
}

function buildFiveE(fetched, domain) {
  if (!domain || !fetched) return { name: '5E竞技', enabled: false, rank: '', stats: {}, radar: [], matches: [] };
  const career = fetched.career ?? {};
  const s = fetched.stats ?? {};
  const total = career.matchTotal ?? 0;
  const winRate = total > 0 ? career.win / total : null;
  const mvpCount = (fetched.matches ?? []).filter((m) => m.mvp).length;
  const stats = {
    rating: s.rating ?? null,
    adr: s.adr ?? null,
    rws: s.rws ?? null,
    kpr: s.kpr ?? null,
    winRate: winRate != null ? pctStr(winRate * 100) : '',
    elo: fetched.elo ?? null,
    role: fetched.role ?? '',
    matchTotal: total || null,
  };
  const matches = (fetched.matches ?? []).map((m) => ({
    id: m.id,
    date: m.date,
    map: m.map,
    enemy: '',
    result: m.result,
    score: m.score,
    kda: m.kda,
    rating: m.rating,
    mvp: m.mvp,
    eloChange: m.eloChange,
  }));
  return {
    name: '5E竞技',
    enabled: true,
    rank: fetched.elo > 0 ? `ELO ${Math.round(fetched.elo)}` : '未定级',
    stats,
    radar: buildRadar({
      rating: s.rating, adr: s.adr, rws: s.rws, winRate,
      ladderValue: ladderFromScore(fetched.elo), ladderRaw: fetched.elo > 0 ? `ELO ${Math.round(fetched.elo)}` : '未定级',
      mvpValue: mvpRate(mvpCount, (fetched.matches ?? []).length), mvpRaw: mvpCount > 0 ? `近 ${(fetched.matches ?? []).length} 场 ${mvpCount} 次` : null,
    }),
    matches,
  };
}

// ─── 主流程 ───
const db = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));
const oldMains = db.players.filter((p) => p.type === 'main');
const bench = db.players.filter((p) => p.type === 'bench');

const mains = [];
for (const [i, cfg] of ROSTER.entries()) {
  const fetched = JSON.parse(fs.readFileSync(cfg.file, 'utf8'));
  const old = oldMains[i] ?? {};

  // Steam 昵称与头像（失败则回退：昵称用群友名，头像用完美头像）
  let steam = { name: '', avatar: '' };
  try {
    steam = await fetchSteamProfile(cfg.steamid);
  } catch (e) {
    console.warn(`[steam] ${cfg.name} 资料获取失败，使用回退值: ${e.message}`);
  }

  mains.push({
    id: cfg.id,
    type: 'main',
    status: 'active',
    profile: {
      ...old.profile,
      name: cfg.name,
      steamName: steam.name || '',
      avatar: steam.avatar || fetched.wanmei?.avatar || '',
      steamId64: cfg.steamid,
      fiveEDomain: cfg.fiveE ?? '',
      // title / role / motto / weapons / joinDate / battleAge 继承旧人设（手动配置）
    },
    homepage: {
      ...old.homepage,
      displayName: steam.name || cfg.name, // 卡片小字用 Steam 昵称
      shortDescription: old.homepage?.shortDescription ?? '',
    },
    badges: old.badges ?? [],
    platforms: {
      official: buildOfficial(fetched.official?.raw),
      wanmei: buildWanmei(fetched.wanmei?.raw),
      fiveE: buildFiveE(fetched.fiveE, cfg.fiveE),
    },
    highlights: old.highlights ?? [],
    career: old.career ?? { honors: [], history: [] },
  });
}

db.players = [...mains, ...bench];
fs.writeFileSync('src/data/players.json', JSON.stringify(db, null, 2) + '\n');

// 摘要输出
for (const p of mains) {
  const pf = p.platforms;
  console.log(
    `${p.profile.name}（${p.profile.title ?? '无称号'}）`,
    `官匹:${pf.official.enabled ? pf.official.stats.rating : '无'}`,
    `完美:${pf.wanmei.enabled ? pf.wanmei.stats.rating : '无'}`,
    `5E:${pf.fiveE.enabled ? pf.fiveE.rank : '无账号'}`,
  );
}
console.log('\n已写入 src/data/players.json');
