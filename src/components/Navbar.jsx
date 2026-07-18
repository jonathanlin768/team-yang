import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import players from '../data/players.json'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const mainPlayers = players.players.filter((p) => p.type === 'main')

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-gold-800/40 bg-xuantie-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-calligraphy text-xl text-gilded">{players.team.name}</span>
          <span className="hidden text-[10px] tracking-[0.3em] text-gold-700 sm:inline">
            {players.team.englishName}
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-gold-400 ${isActive ? 'text-gold-400' : 'text-neutral-400'}`
            }
          >
            中军大帐
          </NavLink>

          {/* 五虎下拉 */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="text-neutral-400 transition-colors hover:text-gold-400">
              点将录 ▾
            </button>
            {open && (
              <div className="absolute right-0 top-full w-44 border border-gold-800/50 bg-xuantie-900/95 shadow-gold-glow clip-corner-sm">
                {mainPlayers.map((p) => (
                  <Link
                    key={p.id}
                    to={`/player/${p.id}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-neutral-300 transition-colors hover:bg-gold-500/10 hover:text-gold-400"
                  >
                    {p.profile.name}
                    <span className="ml-2 text-xs text-gold-700">{p.profile.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
