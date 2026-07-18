/**
 * 5E 对战平台数据抓取模块（基于 Playwright 无头浏览器）
 *
 * 背景：5E 玩家数据由 view-arena.5eplay.com 的 SPA 通过
 * gate.5eplay.com 的私有签名 API（x-ca-key / x-ca-signature，阿里云网关）获取，
 * 且 arena.5eplay.com 页面外层有阿里云 WAF（acw_sc__v2 挑战）。
 * 直接 HTTP 调用不可行，因此本模块用无头浏览器加载页面、
 * 拦截并解析页面自身发出的 API 响应。
 *
 * 可获取：
 *   - uuid（domain → uuid 解析，idTransfer）
 *   - 名片信息（头像等，userinterface/header）
 *   - 生涯总览（ELO、段位 level_id、胜负场、rating/rws/adr/kpr，player_career / v3.player/home）
 *   - 比赛列表（地图、比分、胜负、ELO 变化，player_match）
 *   - 角色定位与能力维度（player/advanced）
 *
 * 注意：依赖页面结构，5E 改版可能导致失效；请控制调用频率。
 */

import { chromium } from 'playwright';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** 需要拦截的 API（url 包含串 → 存储 key） */
const WATCH_APIS = {
  'userauthinterface/http/v1/userinterface/idTransfer': 'idTransfer',
  'userauthinterface/http/v1/userinterface/header': 'header',
  'cranenew/http/api/data/v3/player/home': 'home',
  'cranenew/http/api/data/player_career': 'career',
  'cranenew/http/api/data/player_match': 'matches',
  'cranenew/http/api/data/player/advanced': 'advanced',
  'cranenew/http/api/data/season_list': 'seasonList',
};

const MAP_NAME_CN = {
  de_dust2: '炙热沙城Ⅱ',
  de_mirage: '荒漠迷城',
  de_inferno: '炼狱小镇',
  de_nuke: '核子危机',
  de_overpass: '死亡游乐园',
  de_vertigo: '殒命大厦',
  de_ancient: '远古遗迹',
  de_anubis: '阿努比斯',
  de_train: '列车停放站',
  de_cache: '死城之谜',
};

/**
 * 抓取某个 5E 玩家（domain，即个人页 URL 最后一段）的数据
 * @param {string} domain 如 "15111866rusbyp"
 * @param {{ timeout?: number, headless?: boolean }} opts
 */
export async function fetch5e(domain, opts = {}) {
  const { timeout = 60000, headless = true } = opts;
  const browser = await chromium.launch({ headless });
  try {
    const ctx = await browser.newContext({ userAgent: UA, locale: 'zh-CN' });
    const page = await ctx.newPage();

    const captured = {};
    page.on('response', (res) => {
      const url = res.url();
      for (const [pattern, key] of Object.entries(WATCH_APIS)) {
        if (url.includes(pattern) && !captured[key]) {
          res
            .json()
            .then((j) => {
              captured[key] = j;
            })
            .catch(() => {});
        }
      }
    });

    await page
      .goto(`https://view-arena.5eplay.com/home/personalInfo?domain=${domain}&uuid=null`, {
        waitUntil: 'networkidle',
        timeout,
      })
      .catch(() => {});
    // 兜底等待关键接口返回
    const deadline = Date.now() + 15000;
    while (!captured.home && Date.now() < deadline) {
      await page.waitForTimeout(500);
    }

    if (!captured.idTransfer && !captured.home) {
      throw new Error('未捕获到 5E 玩家数据（页面结构可能已变化）');
    }
    return normalize5e(captured);
  } finally {
    await browser.close();
  }
}

/** 归一化为本站 players.json 的 fiveE 结构片段 */
export function normalize5e(captured) {
  const home = captured.home?.data ?? {};
  const career = captured.career?.data?.career_data ?? {};
  const matchData = captured.matches?.data?.match_data ?? [];
  const advanced = captured.advanced?.data ?? {};
  const header = captured.header?.data ?? {};

  const stats = {
    rating: career.rating ?? null,
    adr: career.adr ?? null,
    kast: '', // 5E 接口未提供 KAST
    entry: '', // 5E 接口未提供首杀率
    hs: '', // 可由 player/advanced 的维度分补充，当前留空
    rws: career.rws ?? null,
    kpr: career.kpr ?? null,
  };

  const matches = matchData.slice(0, 20).map((m) => {
    const s1 = +(m.group1_all_score ?? 0);
    const s2 = +(m.group2_all_score ?? 0);
    const win = m.is_win === true || m.is_win === 1;
    const draw = m.is_tie === true || m.is_tie === 1;
    // 比分统一为「我方-对方」视角：胜场高分在前，负场低分在前
    const score = draw ? `${s1}-${s2}` : win ? `${Math.max(s1, s2)}-${Math.min(s1, s2)}` : `${Math.min(s1, s2)}-${Math.max(s1, s2)}`;
    return {
      id: m.match_id,
      date: m.start_time
        ? new Date(+m.start_time * 1000).toISOString().slice(0, 10)
        : '',
      map: m.map_name || MAP_NAME_CN[m.map] || m.map || '',
      result: draw ? 'draw' : win ? 'win' : 'lose',
      score,
      kda: {
        kill: m.kill != null ? +m.kill : null,
        death: m.death != null ? +m.death : null,
        assist: null, // 5E 列表接口无助攻字段
      },
      rating: m.rating != null ? +m.rating : null,
      rws: m.rws != null ? +m.rws : null,
      adr: m.adr != null ? +m.adr : null,
      mvp: m.is_mvp === true || m.is_mvp === 1,
      svp: m.is_svp === true || m.is_svp === 1,
      eloChange: m.change_elo != null ? +(+m.change_elo).toFixed(1) : null,
      raw: m,
    };
  });

  return {
    fiveE: {
      name: '5E竞技',
      enabled: true,
      uuid: captured.idTransfer?.data?.uuid ?? '',
      elo: home.career?.elo ?? career[`elo_${career.match_type}`] ?? null,
      levelId: home.career?.level_id ?? null,
      rank: home.career?.rank != null ? `全服第 ${home.career.rank} 名` : '',
      role: advanced.role_info?.role ?? '',
      roleDesc: advanced.role_info?.desc ?? '',
      career: {
        matchTotal: home.career?.match_total ?? career.match_total ?? null,
        win: home.career?.match_win ?? career.win_total ?? null,
        tie: home.career?.match_tie ?? career.tie_total ?? null,
        loss: home.career?.match_loss ?? career.loss_total ?? null,
        bestSeason: home.career?.best_season ?? career.best_season ?? '',
      },
      stats,
      matches,
      raw: { home: captured.home, career: captured.career, advanced: captured.advanced, header },
    },
  };
}
