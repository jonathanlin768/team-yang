import { motion } from 'framer-motion'
import players from '../../data/players.json'

const RESULT_STYLE = {
  win: 'text-gold-400 border-gold-600/60',
  lose: 'text-cinnabar border-cinnabar/50',
  draw: 'text-neutral-400 border-neutral-600/60',
}

// 无战报平台的原因说明（征战纪要目前只有 5E 能自动供数）
const EMPTY_HINT = {
  official: '官匹战报暂无可考，兵部未收录',
  wanmei: '完美战报暂无可考，尚需手动补录',
  fiveE: '近期无出战记录',
}

// 征战纪要：战报卷轴列表
export default function MatchHistory({ matches = [], platformKey }) {
  return (
    <div className="clip-corner border border-gold-800/40 bg-black/40 p-4">
      <h3 className="text-center font-calligraphy text-xl text-gold-400">征战纪要</h3>
      {matches.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 pb-10 text-neutral-600">
          <span className="font-calligraphy text-3xl text-gold-800/60">卷宗空空</span>
          <span className="font-serifcn text-xs">{EMPTY_HINT[platformKey] ?? '暂无战报'}</span>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {matches.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="clip-corner-sm border-b border-gold-800/25 bg-xuantie-800/40 px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span
                  className={`border px-1.5 py-0.5 font-serifcn text-xs ${RESULT_STYLE[m.result]}`}
                >
                  {players.enums.battleResults[m.result]}
                </span>
                <span className="text-neutral-200">{m.map}</span>
                {m.enemy && <span className="text-xs text-neutral-500">对阵 {m.enemy}</span>}
                <span className="ml-auto font-mono text-gold-300">{m.score}</span>
                {m.mvp && (
                  <span className="clip-corner-sm bg-gold-600/25 px-1.5 py-0.5 text-[10px] text-gold-400">
                    MVP
                  </span>
                )}
                {m.eloChange != null && (
                  <span
                    className={`font-mono text-[11px] ${m.eloChange >= 0 ? 'text-gold-500' : 'text-cinnabar'}`}
                  >
                    ELO {m.eloChange >= 0 ? '+' : ''}
                    {m.eloChange}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex gap-4 text-xs text-neutral-500">
                <span>{m.date}</span>
                <span>
                  斩获 {m.kda.kill} / 阵亡 {m.kda.death} / 策应 {m.kda.assist ?? '–'}
                </span>
                <span>
                  Rating <span className="text-gold-400">{m.rating}</span>
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
