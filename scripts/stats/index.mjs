/**
 * 选手数据抓取 CLI
 *
 * 用法：
 *   node scripts/stats/index.mjs --steamid 76561198253603000          # 只抓完美（官匹+完美平台）
 *   node scripts/stats/index.mjs --5e 15111866rusbyp                  # 只抓 5E
 *   node scripts/stats/index.mjs --steamid 7656... --5e 1511...       # 两个都抓
 *   node scripts/stats/index.mjs --steamid 7656... --out out.json     # 写入文件
 *
 * 输出：归一化后的 JSON（结构与 src/data/players.json 的 platforms 对齐），
 * 各平台附 raw 字段保留原始返回，便于后续扩展字段时不必重新抓取。
 */

import fs from 'node:fs';
import { fetchWmpvp } from './wmpvp.mjs';
import { fetch5e } from './fiveE.mjs';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--steamid') args.steamid = argv[++i];
    else if (a === '--5e') args.fiveE = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--headed') args.headed = true;
  }
  return args;
}

const args = parseArgs(process.argv);
if (!args.steamid && !args.fiveE) {
  console.error('用法: node scripts/stats/index.mjs [--steamid <steamId64>] [--5e <domain>] [--out <file>] [--headed]');
  process.exit(1);
}

const result = { fetchedAt: new Date().toISOString() };

if (args.steamid) {
  console.error(`[1/2] 抓取完美平台数据 (steamId64=${args.steamid}) ...`);
  const wmpvp = await fetchWmpvp(args.steamid);
  Object.assign(result, wmpvp);
  console.error('      完成');
}

if (args.fiveE) {
  console.error(`[2/2] 抓取 5E 数据 (domain=${args.fiveE})，启动无头浏览器 ...`);
  const fiveE = await fetch5e(args.fiveE, { headless: !args.headed });
  Object.assign(result, fiveE);
  console.error('      完成');
}

const json = JSON.stringify(result, null, 2);
if (args.out) {
  fs.writeFileSync(args.out, json);
  console.error(`已写入 ${args.out}`);
} else {
  console.log(json);
}
