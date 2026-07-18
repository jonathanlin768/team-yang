import players from '../data/players.json'

export default function Footer() {
  return (
    <footer className="border-t border-gold-800/30 bg-xuantie-950 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="font-calligraphy text-xl text-gold-600">{players.team.name}</p>
        <p className="mt-1 text-[10px] tracking-[0.4em] text-neutral-600">
          {players.team.englishName}
        </p>
        <p className="mt-3 font-serifcn text-xs text-neutral-500">
          {players.team.motto} · {players.team.description}
        </p>
        <p className="mt-4 text-[10px] text-neutral-700">
          本站为战队同好站点，与 Valve、完美世界、5EPlay 无隶属关系
        </p>
      </div>
    </footer>
  )
}
