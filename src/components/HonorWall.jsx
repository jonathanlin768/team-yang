import { motion } from 'framer-motion'
import players from '../data/players.json'

// 荣誉墙：聚合全员 career.honors 与近期大捷场次，卷轴榜单风格
export default function HonorWall() {
  // 聚合荣誉
  const honors = players.players.flatMap((p) =>
    p.career.honors.map((h) => ({ ...h, player: p.profile.name })),
  )
  // 聚合近期大捷（全员跨平台 win 场次，按日期倒序取 6 条）
  const victories = players.players
    .flatMap((p) =>
      Object.entries(p.platforms).flatMap(([key, pl]) =>
        pl.matches
          .filter((m) => m.result === 'win')
          .map((m) => ({ ...m, player: p.profile.name, platform: players.enums.platforms[key] })),
      ),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h2 className="font-calligraphy text-gilded text-4xl">战功榜 · 荣誉墙</h2>
        <p className="mt-2 text-sm tracking-[0.3em] text-neutral-500">HALL OF GLORY · 名垂竹帛</p>
        <div className="rule-imperial mx-auto mt-6 w-56" />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 荣誉卷轴 */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="clip-corner border-gold-grad bg-xuantie-900 bg-brushed p-6"
        >
          <h3 className="font-calligraphy text-2xl text-gold-400">军中荣誉</h3>
          <ul className="mt-4 space-y-3">
            {honors.map((h, i) => (
              <li
                key={`${h.id}-${i}`}
                className="flex items-baseline justify-between border-b border-gold-800/25 pb-2 text-sm"
              >
                <span className="text-neutral-300">
                  <span className="mr-2 text-gold-500">◆</span>
                  {h.name}
                </span>
                <span className="text-xs text-neutral-500">
                  {h.player} · {h.year}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 近期大捷 */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="clip-corner border-gold-grad bg-xuantie-900 bg-brushed p-6"
        >
          <h3 className="font-calligraphy text-2xl text-gold-400">近期大捷</h3>
          <ul className="mt-4 space-y-3">
            {victories.map((m, i) => (
              <li
                key={`${m.player}-${m.id}-${i}`}
                className="flex items-baseline justify-between border-b border-gold-800/25 pb-2 text-sm"
              >
                <span className="text-neutral-300">
                  <span className="mr-2 font-serifcn text-gold-500">大捷</span>
                  {m.player} 破 {m.enemy} 于{m.map}
                </span>
                <span className="text-xs text-neutral-500">
                  {m.score} · {m.date}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
