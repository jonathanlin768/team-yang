import { motion } from 'framer-motion'
import AvatarStamp from './AvatarStamp.jsx'
import SealStamp from './SealStamp.jsx'
import players from '../data/players.json'

const PLATFORM_LABELS = players.enums.platforms

// 军令牌卡片（先锋五虎）
export default function GeneralCard({ player, onClick }) {
  const { profile, homepage, platforms } = player
  // 取最高 Rating 的平台作为最高战绩展示
  const best = Object.entries(platforms)
    .filter(([, p]) => p.enabled)
    .sort((a, b) => b[1].stats.rating - a[1].stats.rating)[0]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="clip-corner group relative flex h-[500px] w-full flex-col border border-gold-800/50 bg-gradient-to-b from-xuantie-800 to-xuantie-950 bg-brushed p-4 text-left transition-shadow duration-300 hover:border-gold-500/70 hover:shadow-gold-glow"
    >
      {/* 顶部画像框：方形铜框 + 铆钉 */}
      <div className="clip-corner-sm relative h-56 w-full border-2 border-bronze-500/70">
        <AvatarStamp name={profile.name} size="lg" />
        {/* 铆钉 */}
        {['left-1 top-1', 'right-1 top-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} h-1.5 w-1.5 rounded-full bg-gradient-to-br from-gold-400 to-gold-800`}
          />
        ))}
        {/* 火漆印章 */}
        <SealStamp text="杨" className="absolute -bottom-2 -right-2 group-hover:shadow-gold-glow" />
        {/* hover 刀锋亮边 */}
        <span className="pointer-events-none absolute inset-0 border border-gold-400/0 transition-all duration-300 group-hover:border-gold-400/60" />
      </div>

      {/* 中部：ID / 军职 / 称号 */}
      <div className="mt-5 flex-1">
        <p className="font-calligraphy text-3xl text-gold-300">{profile.name}</p>
        <p className="mt-1 text-xs tracking-[0.25em] text-neutral-500">{homepage.displayName}</p>
        <p className="mt-2 font-serifcn text-sm text-neutral-300">
          {profile.title}
          <span className="mx-1 text-gold-700">·</span>
          {profile.role.primary}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">
          {homepage.shortDescription}
        </p>
        {/* 星级 */}
        <p className="mt-2 text-gold-500" aria-label={`${homepage.stars}星`}>
          {'★'.repeat(homepage.stars)}
          <span className="text-xuantie-600">{'★'.repeat(5 - homepage.stars)}</span>
        </p>
      </div>

      {/* 底部：征战平台与最高战绩 */}
      <div className="mt-3 border-t border-gold-800/40 pt-3">
        <div className="flex gap-2">
          {Object.entries(platforms).map(([key, p]) => (
            <span
              key={key}
              className={`clip-corner-sm px-2 py-0.5 text-[10px] ${
                p.enabled ? 'bg-gold-800/30 text-gold-400' : 'bg-xuantie-700 text-neutral-600'
              }`}
            >
              {PLATFORM_LABELS[key]}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-baseline justify-between text-xs text-neutral-400">
          <span>
            最高 Rating <span className="text-base font-bold text-gold-400">{best[1].stats.rating}</span>
          </span>
          <span>
            ADR <span className="text-base font-bold text-gold-400">{best[1].stats.adr}</span>
          </span>
        </div>
      </div>
    </motion.button>
  )
}
