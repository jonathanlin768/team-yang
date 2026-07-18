import { motion } from 'framer-motion'
import AvatarStamp from '../AvatarStamp.jsx'
import SealStamp from '../SealStamp.jsx'
import players from '../../data/players.json'

// 列传页头部：武将画像框 + 档案
export default function GeneralHeader({ player }) {
  const { profile } = player
  const fields = [
    ['军职', `${profile.title} · ${profile.role.primary}`],
    ['定位', [profile.role.primary, ...profile.role.secondary].join(' / ')],
    ['所属', `${players.team.name}（${players.enums.playerTypes[player.type]}）`],
    ['战龄', profile.battleAge],
    ['入伍', profile.joinDate],
    ['常用兵器', profile.weapons.join('、')],
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-8 md:flex-row"
    >
      {/* 武将画像框 */}
      <div className="group relative mx-auto w-64 shrink-0 md:mx-0">
        <div className="clip-corner relative h-72 border-2 border-bronze-500/80 bg-brushed">
          <AvatarStamp name={profile.name} avatar={profile.avatar} size="xl" />
          {/* 铆钉 */}
          {['left-1.5 top-1.5', 'right-1.5 top-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'].map(
            (pos) => (
              <span
                key={pos}
                className={`absolute ${pos} h-2 w-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-800`}
              />
            ),
          )}
          {/* 火漆印章：hover 浮现 */}
          <SealStamp
            text="虎"
            size="lg"
            className="absolute -bottom-3 -right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          {/* hover 暗金粒子光晕 */}
          <span className="pointer-events-none absolute inset-0 opacity-0 shadow-gold-glow transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      {/* 档案 */}
      <div className="flex-1">
        <p className="text-[10px] tracking-[0.5em] text-gold-700">{players.team.name}</p>
        <h1 className="mt-1 font-calligraphy text-gilded text-5xl md:text-6xl">{profile.name}</h1>
        <p className="mt-1 text-sm tracking-[0.3em] text-neutral-500">
          {player.homepage.displayName}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-gold-800/25 pb-2 text-sm">
              <span className="w-16 shrink-0 font-serifcn text-gold-600">{k}</span>
              <span className="text-neutral-300">{v}</span>
            </div>
          ))}
        </div>

        <blockquote className="mt-6 border-l-2 border-gold-600/60 pl-4 font-serifcn text-lg italic text-gold-400/90">
          「{profile.motto}」
        </blockquote>
      </div>
    </motion.section>
  )
}
