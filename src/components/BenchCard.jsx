import { Link } from 'react-router-dom'
import AvatarStamp from './AvatarStamp.jsx'
import players from '../data/players.json'

// 偏将铜牌：hover 时 3D 翻转，背面显示最近出战信息
export default function BenchCard({ player }) {
  const { profile, homepage, platforms } = player
  // 最近一场比赛（取官匹最近一场）
  const recent = platforms.official.matches[0]
  const resultLabel = players.enums.battleResults[recent.result]

  return (
    <div className="group h-[300px] w-full [perspective:1000px]">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* 正面：青铜令牌 */}
        <div className="clip-corner absolute inset-0 flex flex-col items-center border border-bronze-500/60 bg-gradient-to-b from-xuantie-800 to-xuantie-950 bg-brushed p-4 [backface-visibility:hidden]">
          <div className="clip-corner-sm h-28 w-28 border border-bronze-500/70">
            <AvatarStamp name={profile.name} avatar={profile.avatar} size="md" />
          </div>
          <p className="mt-3 font-calligraphy text-2xl text-bronze-400">{profile.name}</p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-neutral-500">{homepage.displayName}</p>
          <p className="mt-1.5 font-serifcn text-xs text-neutral-400">
            {profile.title} · {profile.role.primary}
          </p>
          <p className="mt-auto text-[10px] text-neutral-600">悬停翻面 · 点击背面查看列传</p>
        </div>

        {/* 背面：隐藏信息 */}
        <Link
          to={`/player/${player.id}`}
          className="clip-corner absolute inset-0 flex flex-col border border-gold-800/60 bg-gradient-to-b from-xuantie-700 to-xuantie-950 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <p className="font-calligraphy text-lg text-gold-400">{profile.name} · 近况</p>
          <div className="mt-3 space-y-2 text-xs text-neutral-300">
            <p>
              <span className="text-gold-700">最近出战：</span>
              {recent.date} · {recent.map}
            </p>
            <p>
              <span className="text-gold-700">战绩：</span>
              {resultLabel} {recent.score}（{recent.kda.kill}-{recent.kda.death}-{recent.kda.assist}）
            </p>
            <p>
              <span className="text-gold-700">评价：</span>
              {recent.rating >= 1.1 ? '骁勇可用，候令听调。' : recent.rating >= 0.95 ? '中规中矩，尚需磨砺。' : '状态低迷，当厉兵秣马。'}
            </p>
          </div>
          <p className="mt-auto text-center text-xs text-gold-500">查看列传 →</p>
        </Link>
      </div>
    </div>
  )
}
