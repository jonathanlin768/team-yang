import { useMemo } from 'react'
import { motion } from 'framer-motion'
import players from '../data/players.json'

// 战旗剪影（SVG，低透明度缓慢飘动）
function WarFlag({ className }) {
  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden>
      <g fill="#D4AF37" fillOpacity="0.05">
        <rect x="18" y="0" width="5" height="320" />
        <path d="M23 10 C90 4 150 22 196 10 L186 46 C196 46 186 82 196 82 C150 96 90 78 23 90 Z" />
        <path d="M23 110 C80 104 130 118 176 108 L168 138 C178 138 168 168 178 168 C130 180 80 166 23 176 Z" opacity="0.7" />
      </g>
    </svg>
  )
}

// 金色尘埃粒子（CSS 动画轻量实现）
function Dust() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        size: 1 + ((i * 13) % 3),
        duration: 7 + ((i * 7) % 8),
        delay: (i * 1.3) % 9,
        opacity: 0.25 + ((i * 17) % 40) / 100,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="animate-dust absolute bottom-0 rounded-full bg-gold-400"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: '0 0 6px rgba(212,175,55,0.8)',
          }}
        />
      ))}
    </div>
  )
}

export default function HeroBanner() {
  const scrollToFive = () => {
    document.getElementById('starting-five')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-14">
      {/* 背景纹理 */}
      <div className="absolute inset-0 bg-cloud opacity-70" aria-hidden />

      {/* 战旗剪影 */}
      <WarFlag className="animate-flag absolute -left-6 top-0 h-[85%] w-auto" />
      <WarFlag className="animate-flag absolute -right-6 top-0 h-[70%] w-auto scale-x-[-1] [animation-delay:-3s]" />

      {/* 金色尘埃 */}
      <Dust />

      {/* 刀锋光效 */}
      <div
        className="animate-blade pointer-events-none absolute top-1/3 h-24 w-40 bg-gradient-to-r from-transparent via-gold-300/25 to-transparent blur-md"
        aria-hidden
      />

      {/* 左右竖排军旗文字 */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 md:block">
        <p className="font-calligraphy text-2xl tracking-[0.5em] text-gold-600/60 [writing-mode:vertical-rl]">
          杨门虎骑
        </p>
      </div>
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:block">
        <p className="font-calligraphy text-2xl tracking-[0.5em] text-gold-600/60 [writing-mode:vertical-rl]">
          CS2 征战录
        </p>
      </div>

      {/* 中央主体 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center px-4 text-center"
      >
        <h1 className="font-calligraphy text-gilded text-7xl leading-tight md:text-9xl">
          {players.team.name}
        </h1>
        <p className="mt-3 text-xs tracking-[0.5em] text-gold-600 md:text-sm">
          {players.team.englishName}
        </p>

        {/* 军令状装饰线 */}
        <div className="rule-imperial mt-8 w-64 md:w-96" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 font-serifcn text-lg text-neutral-300 md:text-xl"
        >
          {players.team.motto}
          <span className="mx-3 text-gold-700">·</span>
          {players.team.description}
        </motion.p>

        {/* 兵符按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={scrollToFive}
          className="clip-charm hover-sheen mt-12 border border-gold-600/70 bg-gradient-to-b from-xuantie-700 to-xuantie-900 px-10 py-3 font-calligraphy text-xl text-gold-400 shadow-gold-glow transition-colors hover:text-gold-300"
        >
          点将开始
        </motion.button>
      </motion.div>

      {/* 底部渐隐 */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-xuantie-900 to-transparent" aria-hidden />
    </header>
  )
}
