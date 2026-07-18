/**
 * 完美世界电竞平台（wmpvp）数据抓取模块
 *
 * 接口来源：开源项目 https://github.com/M3351AN/CS2-Stats-Fetch
 * 三个公开接口均无需登录态：
 *   1. getUserIdBySteamId   —— steamId64 → 完美内部 userId
 *   2. detailStats          —— 生涯/官匹综合数据（rating、adr、kast、爆头率等）
 *   3. pvpDetailDataStats   —— 完美平台赛季数据（含段位相关 pwRating、热图等）
 *
 * 注意：均为非官方公开接口，字段以实际返回为准，调用需自行控制频率。
 */

const UA = 'okhttp/4.11.0';

async function postJson(url, payload, extraHeaders = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/json',
      t: Math.floor(Date.now() / 1000).toString(),
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`wmpvp 请求失败: HTTP ${res.status} ${url}`);
  return res.json();
}

/** steamId64 → 完美内部 userId */
export async function getUserIdBySteamId(steamId64) {
  const res = await fetch(
    `https://appengine.wmpvp.com/steamcn/app/common/getUserIdBySteamId?steamId=${steamId64}`,
    { headers: { 'User-Agent': UA } },
  );
  if (!res.ok) throw new Error(`getUserIdBySteamId HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 1) throw new Error(`getUserIdBySteamId 返回异常: ${JSON.stringify(json)}`);
  return json.result.userId;
}

/**
 * 生涯/官匹综合数据（CS2 官匹维度）
 * 返回原始 data 字段：rating / adr / kast / kd / winRate / rws /
 * headShotRatio / entryKillRatio / hours / friendCode / historyRatings / hotMaps ...
 */
export async function getOfficialStats(steamId64) {
  const json = await postJson(
    'https://api.wmpvp.com/api/csgo/home/official/detailStats',
    { toSteamId: String(steamId64), mySteamId: String(steamId64), accessToken: '' },
    { gameType: '1,2', gameTypeStr: '1,2' },
  );
  if (json.statusCode !== 0) throw new Error(`detailStats 返回异常: ${json.errorMessage}`);
  return json.data;
}

/**
 * 完美平台赛季数据（PVP 维度）
 * @param {string|number} steamId64
 * @param {string} csgoSeasonId 赛季 ID，如 "S24"；传空字符串默认当前赛季
 * 返回原始 data 字段：seasonId / name / avatar / rating / pwRating / adr /
 * headShotRatio / entryKillRatio / winRate / mvpCount / vs1..vs5 / hotMaps ...
 */
export async function getSeasonStats(steamId64, csgoSeasonId = '') {
  const json = await postJson(
    'https://api.wmpvp.com/api/v2/csgo/pvpDetailDataStats',
    { steamId64: String(steamId64), csgoSeasonId },
  );
  if (json.statusCode !== 0) throw new Error(`pvpDetailDataStats 返回异常: ${json.errorMessage}`);
  return json.data;
}

/**
 * 归一化为本站 players.json 的 platforms 结构片段
 * （rating/adr 为数字；kast/entry/hs 为带 % 字符串，与现有数据格式一致）
 */
export function normalizeWmpvp(official, season) {
  const pct = (v) => (v == null ? '' : `${(+v * 100).toFixed(1)}%`);
  return {
    official: official
      ? {
          name: '官匹 CS2',
          enabled: true,
          stats: {
            rating: official.rating ?? null,
            adr: official.adr ?? null,
            kast: official.kast != null ? `${official.kast}%` : '',
            entry: pct(official.entryKillRatio),
            hs: pct(official.headShotRatio),
          },
          raw: official,
        }
      : null,
    wanmei: season
      ? {
          name: '完美世界',
          enabled: true,
          seasonId: season.seasonId ?? '',
          nickName: season.name ?? '',
          avatar: season.avatar ?? '',
          stats: {
            rating: season.rating ?? season.pwRating ?? null,
            adr: season.adr ?? null,
            kast: '', // 赛季接口无 KAST 字段
            entry: pct(season.entryKillRatio),
            hs: pct(season.headShotRatio),
          },
          raw: season,
        }
      : null,
  };
}

/** 一键抓取某个 steamId64 的完美系全部数据 */
export async function fetchWmpvp(steamId64) {
  const [official, season] = await Promise.all([
    getOfficialStats(steamId64).catch((e) => {
      console.warn(`[wmpvp] 官匹数据获取失败: ${e.message}`);
      return null;
    }),
    getSeasonStats(steamId64).catch((e) => {
      console.warn(`[wmpvp] 赛季数据获取失败: ${e.message}`);
      return null;
    }),
  ]);
  return normalizeWmpvp(official, season);
}
