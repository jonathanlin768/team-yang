import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AvatarStamp from './AvatarStamp.jsx'
import SealStamp from './SealStamp.jsx'
import players from '../data/players.json'

// 人物志弹窗：圣旨卷轴/军机密档风格
export default function BiographyModal({ player, onClose }) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="clip-corner relative w-full max-w-2xl border-gold-grad bg-xuantie-900 bg-brushed p-6 shadow-gold-glow md:p-8"
          >
            {/* 卷轴轴头装饰 */}
            <span className="absolute -left-1 top-4 h-[calc(100%-2rem)] w-1.5 rounded bg-gradient-to-b from-gold-600 via-gold-800 to-gold-600" />
            <span className="absolute -right-1 top-4 h-[calc(100%-2rem)] w-1.5 rounded bg-gradient-to-b from-gold-600 via-gold-800 to-gold-600" />

            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-neutral-500 transition-colors hover:text-gold-400"
              aria-label="关闭"
            >
              ✕
            </button>

            {/* 顶部：星级 + 队名 + ID */}
            <div className="text-center">
              <p className="text-gold-500">{'★'.repeat(player.homepage.stars)}</p>
              <p className="mt-1 text-[10px] tracking-[0.4em] text-gold-700">
                {players.team.name} · 军机密档
              </p>
              <h3 className="mt-2 font-calligraphy text-gilded text-4xl">{player.profile.name}</h3>
              <p className="mt-1 text-xs tracking-[0.3em] text-neutral-500">
                {player.homepage.displayName}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row">
              {/* 左侧画像 */}
              <div className="clip-corner-sm relative mx-auto h-48 w-40 shrink-0 border-2 border-bronze-500/70">
                <AvatarStamp name={player.profile.name} avatar={player.profile.avatar} size="lg" />
                <SealStamp text="将" className="absolute -bottom-2 -right-2" />
              </div>

              {/* 右侧资料 */}
              <dl className="flex-1 space-y-2.5 text-sm">
                {[
                  ['军职', `${player.profile.title} · ${player.profile.role.primary}`],
                  ['战法', [player.profile.role.primary, ...player.profile.role.secondary].join(' / ')],
                  ['所属', `${players.team.name}（${players.enums.playerTypes[player.type]}）`],
                  ['常用兵器', player.profile.weapons.join('、')],
                  ['座右铭', player.profile.motto],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-20 shrink-0 font-serifcn text-gold-600">{k}</dt>
                    <dd className="text-neutral-300">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 底部按钮 */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div className="clip-charm flex border border-gold-800/60 text-sm">
                <a
                  href="https://pvp.wanmei.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover-sheen px-4 py-2 text-gold-500 transition-colors hover:text-gold-300"
                >
                  外域探查 · 完美
                </a>
                <span className="border-l border-gold-800/60" />
                <a
                  href="https://www.5eplay.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover-sheen px-4 py-2 text-gold-500 transition-colors hover:text-gold-300"
                >
                  5E
                </a>
              </div>
              <button
                onClick={() => navigate(`/player/${player.id}`)}
                className="clip-charm hover-sheen border border-gold-600/70 bg-gradient-to-b from-gold-700/30 to-xuantie-900 px-6 py-2 font-calligraphy text-lg text-gold-400 shadow-gold-glow transition-colors hover:text-gold-300"
              >
                查看列传
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
