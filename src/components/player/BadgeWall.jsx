import { motion } from 'framer-motion'

const LEVEL_STYLE = {
  gold: 'border-gold-500/80 text-gold-300 shadow-gold-glow',
  silver: 'border-neutral-400/60 text-neutral-300',
  bronze: 'border-bronze-500/60 text-bronze-400',
}
const LEVEL_LABEL = { gold: '金印', silver: '银印', bronze: '铜印' }

// 将印标签墙：小型黄金兵符，逐个浮现
export default function BadgeWall({ badges }) {
  return (
    <section className="mt-14">
      <h2 className="font-calligraphy text-gilded text-3xl">将印</h2>
      <div className="rule-imperial mt-4 w-40" />
      <div className="mt-6 flex flex-wrap gap-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.12 }}
            className={`clip-token group relative flex h-28 w-24 flex-col items-center justify-center border bg-gradient-to-b from-xuantie-700 to-xuantie-950 bg-brushed px-2 text-center ${LEVEL_STYLE[b.level]}`}
          >
            <span className="font-calligraphy text-base leading-tight">{b.name}</span>
            <span className="mt-1 text-[10px] text-neutral-500">{LEVEL_LABEL[b.level]}</span>
            {/* hover tooltip：获得条件 */}
            <span className="clip-corner-sm pointer-events-none absolute -top-14 left-1/2 z-10 w-44 -translate-x-1/2 border border-gold-800/60 bg-xuantie-950/95 px-3 py-2 text-[11px] leading-relaxed text-neutral-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {b.description}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
