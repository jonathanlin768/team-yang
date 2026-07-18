import { motion } from 'framer-motion'
import BenchCard from './BenchCard.jsx'
import players from '../data/players.json'

export default function BenchSection() {
  const benches = players.players.filter((p) => p.type === 'bench')

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h2 className="font-calligraphy text-4xl text-bronze-400">{players.enums.playerTypes.bench}</h2>
        <p className="mt-2 text-sm tracking-[0.3em] text-neutral-500">BENCH · 候命听调</p>
        <div className="rule-imperial mx-auto mt-6 w-56 opacity-60" />
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {benches.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <BenchCard player={p} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
