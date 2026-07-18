import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import GeneralHeader from '../components/player/GeneralHeader.jsx'
import BadgeWall from '../components/player/BadgeWall.jsx'
import PlatformTabs from '../components/player/PlatformTabs.jsx'
import HighlightPlayer from '../components/player/HighlightPlayer.jsx'
import Footer from '../components/Footer.jsx'
import players from '../data/players.json'

// 列传页：深夜军帐中阅读战报
export default function PlayerDetail() {
  const { id } = useParams()
  const player = players.players.find((p) => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // 查无此将
  if (!player) {
    return (
      <main className="bg-parchment flex min-h-screen flex-col items-center justify-center px-4 pt-14 text-center">
        <p className="font-calligraphy text-gilded text-6xl">查无此将</p>
        <p className="mt-4 font-serifcn text-neutral-400">
          军中并无「{id}」之名录，或为讹传，或已解甲归田。
        </p>
        <Link
          to="/"
          className="clip-charm hover-sheen mt-8 border border-gold-600/70 bg-gradient-to-b from-xuantie-700 to-xuantie-900 px-8 py-2.5 font-calligraphy text-lg text-gold-400 shadow-gold-glow"
        >
          返回中军大帐
        </Link>
      </main>
    )
  }

  return (
    <main className="bg-parchment min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-sm text-gold-700 transition-colors hover:text-gold-400">
          ← 返回中军大帐
        </Link>
        <div className="mt-6">
          <GeneralHeader player={player} />
          <BadgeWall badges={player.badges} />
          <PlatformTabs player={player} />
          <HighlightPlayer highlights={player.highlights} />
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  )
}
