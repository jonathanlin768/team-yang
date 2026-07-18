import { motion } from 'framer-motion'
import BilibiliPlayer from '../BilibiliPlayer.jsx'

// 战阵回放：黑金边框 + 卷轴装饰 + 四角纹理
export default function HighlightPlayer({ highlights }) {
  return (
    <section className="mt-14">
      <h2 className="font-calligraphy text-gilded text-3xl">战阵回放</h2>
      <div className="rule-imperial mt-4 w-40" />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {highlights.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="clip-corner border-gold-grad bg-xuantie-900 bg-brushed p-4"
          >
            {/* 四角纹理 */}
            <div className="relative">
              <span className="absolute -left-1 -top-1 z-10 h-4 w-4 border-l-2 border-t-2 border-gold-500/70" />
              <span className="absolute -right-1 -top-1 z-10 h-4 w-4 border-r-2 border-t-2 border-gold-500/70" />
              <span className="absolute -bottom-1 -left-1 z-10 h-4 w-4 border-b-2 border-l-2 border-gold-500/70" />
              <span className="absolute -bottom-1 -right-1 z-10 h-4 w-4 border-b-2 border-r-2 border-gold-500/70" />
              <BilibiliPlayer bvid={h.bvid} title={h.title} />
            </div>
            <h3 className="mt-4 font-serifcn text-lg text-gold-300">{h.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-400">{h.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
