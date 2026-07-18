import { motion } from 'framer-motion'
import GeneralCard from './GeneralCard.jsx'
import players from '../data/players.json'

export default function StartingFive({ onSelect }) {
  const mains = players.players.filter((p) => p.type === 'main')

  return (
    <section id="starting-five" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h2 className="font-calligraphy text-gilded text-5xl">{players.enums.playerTypes.main}</h2>
        <p className="mt-2 text-sm tracking-[0.3em] text-neutral-500">STARTING FIVE · 首发出阵</p>
        <div className="rule-imperial mx-auto mt-6 w-56" />
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {mains.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
          >
            <GeneralCard player={p} onClick={() => onSelect(p)} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
