/**
 * Steam 个人资料抓取模块（免 API Key）
 *
 * 数据源：Steam 小名片页面 https://steamcommunity.com/miniprofile/{accountId}
 *   - accountId（32 位）= steamId64 - 76561197960265728
 *   - 返回 HTML 片段，解析出昵称、头像、Steam 等级
 *
 * 备选方案（需要 API Key）：ISteamUser/GetPlayerSummaries
 *   若以后申请了 Steam API Key，可换成官方接口，返回结构在下方注释中注明。
 *
 * 网络说明：steamcommunity.com 在大陆通常需要代理，
 * 本模块先尝试直连，失败后回退到本地代理（可用环境变量 STEAM_PROXY 覆盖）。
 */

import { ProxyAgent, fetch as undiciFetch } from 'undici';

const STEAM_ID64_BASE = 76561197960265728n;
const PROXY_URL = process.env.STEAM_PROXY ?? 'http://127.0.0.1:7897';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

export function steamId64ToAccountId(steamId64) {
  return (BigInt(steamId64) - STEAM_ID64_BASE).toString();
}

async function fetchHtml(url) {
  // 先直连
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    if (res.ok) return await res.text();
  } catch {
    /* 直连失败，走代理 */
  }
  // 回退代理
  const dispatcher = new ProxyAgent(PROXY_URL);
  const res = await undiciFetch(url, { headers: { 'User-Agent': UA }, dispatcher });
  if (!res.ok) throw new Error(`miniprofile HTTP ${res.status}`);
  return res.text();
}

/**
 * 抓取 Steam 昵称与头像
 * @param {string|number} steamId64
 * @returns {{ name: string, avatar: string, level: string|null }}
 *   name   —— Steam 昵称（persona name）
 *   avatar —— 完整尺寸头像 URL（fastly CDN，国内可直连）
 *   level  —— Steam 等级（可能为空）
 */
export async function fetchSteamProfile(steamId64) {
  const accountId = steamId64ToAccountId(steamId64);
  const html = await fetchHtml(`https://steamcommunity.com/miniprofile/${accountId}`);

  const name = html.match(/<span class="persona[^"]*">([^<]+)<\/span>/)?.[1]?.trim() ?? '';
  // 头像：取 srcset 里的 _full 版本，没有则退回 src
  const avatar =
    html.match(/srcset="[^"]*?(https:[^\s"]+_full\.jpg)\s+2x"/)?.[1] ??
    html.match(/playersection_avatar[\s\S]*?<img src="([^"]+)"/)?.[1] ??
    '';
  const level = html.match(/friendPlayerLevelNum">(\d+)</)?.[1] ?? null;

  if (!name) throw new Error(`未能从 miniprofile 解析昵称（steamId64=${steamId64}）`);
  return { name, avatar, level };
}

/*
 * 官方接口备忘（需 API Key，https://steamcommunity.com/dev/apikey 免费申请）：
 *   GET https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=KEY&steamids=7656...
 *   → response.players[0] = { personaname, avatarfull, ... }
 */
