import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AbilityRadar from './AbilityRadar.jsx'
import MatchHistory from './MatchHistory.jsx'
import players from '../../data/players.json'

// 三平台差异化展示：只展示该平台实际能获取到的数据项
// （官匹独有 KAST/好友码/时长；完美独有天梯分/MVP；5E 独有 ELO/KPR/角色定位）
const STAT_FIELDS = {
  official: [
    ['rating', 'Rating'],
    ['adr', 'ADR'],
    ['rws', 'RWS'],
    ['winRate', '胜率'],
    ['kast', 'KAST'],
    ['entry', '首杀率'],
    ['hs', '爆头率'],
    ['matches', '总场次'],
    ['hours', '游戏时长', (v) => `${v}h`],
  ],
  wanmei: [
    ['rating', 'Rating'],
    ['adr', 'ADR'],
    ['rws', 'RWS'],
    ['winRate', '胜率'],
    ['entry', '首杀率'],
    ['hs', '爆头率'],
    ['mvpCount', 'MVP 次数'],
    ['pvpScore', '天梯分'],
    ['seasonId', '赛季'],
  ],
  fiveE: [
    ['rating', 'Rating'],
    ['adr', 'ADR'],
    ['rws', 'RWS'],
    ['kpr', 'KPR'],
    ['winRate', '胜率'],
    ['matchTotal', '生涯场次'],
    ['role', '角色定位'],
  ],
}

// 兵符平台切换：官匹 CS2 / 完美世界 / 5E
// enabled=false 的平台（无账号或无数据）自动隐藏页签
export default function PlatformTabs({ player }) {
  const keys = Object.keys(players.enums.platforms).filter((k) => player.platforms[k]?.enabled)
  const [active, setActive] = useState(keys[0])
  const platform = player.platforms[active]

  if (keys.length === 0) return null

  // 该平台有值的数据项
  const fields = (STAT_FIELDS[active] ?? []).filter(([key]) => {
    const v = platform.stats[key]
    return v !== null && v !== undefined && v !== ''
  })

  return (
    <section className="mt-14">
      <h2 className="font-calligraphy text-gilded text-3xl">征战数据</h2>
      <div className="rule-imperial mt-4 w-40" />

      {/* 兵符 Tabs */}
      <div className="mt-6 flex flex-wrap gap-3">
        {keys.map((key) => {
          const selected = key === active
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`clip-charm relative px-6 py-2.5 font-calligraphy text-lg transition-all duration-300 ${
                selected
                  ? 'border border-gold-500/80 bg-gradient-to-b from-gold-700/30 to-xuantie-900 text-gold-300 shadow-gold-glow'
                  : 'border border-bronze-600/40 bg-xuantie-800/60 text-bronze-500/70 hover:text-bronze-400'
              }`}
            >
              {players.enums.platforms[key]}
              {/* 选中时印章浮现 */}
              {selected && (
                <span className="seal-appear absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center border border-cinnabar bg-cinnabar/20 font-calligraphy text-[10px] text-cinnabar">
                  令
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 内容区：左右切换动画 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-8"
        >
          {/* 段位 + 数值（按平台差异化） */}
          <div className="clip-corner border-gold-grad bg-xuantie-900 bg-brushed p-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serifcn text-sm text-gold-700">
                {active === 'fiveE' ? '天梯段位' : active === 'wanmei' ? '天梯分数' : '官匹优先'}
              </span>
              <span className="font-calligraphy text-3xl text-gold-400">{platform.rank}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {fields.map(([key, label, fmt]) => (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold text-gold-300">
                    {fmt ? fmt(platform.stats[key]) : platform.stats[key]}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 雷达 + 战绩 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <AbilityRadar radar={platform.radar} platformName={platform.name} />
            <MatchHistory matches={platform.matches} platformKey={active} />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
