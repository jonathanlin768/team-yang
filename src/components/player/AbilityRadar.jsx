import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// 将帅能力罗盘
export default function AbilityRadar({ radar, platformName }) {
  return (
    <div className="clip-corner border border-gold-800/40 bg-black/40 p-4">
      <h3 className="text-center font-calligraphy text-xl text-gold-400">
        将帅能力罗盘 · {platformName}
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radar} outerRadius="72%">
            <PolarGrid stroke="#6E5626" strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#C5A059', fontSize: 13, fontFamily: '"Noto Serif SC", serif' }}
            />
            <PolarRadiusAxis domain={[0, 150]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="#D4AF37"
              strokeWidth={2}
              fill="#D4AF37"
              fillOpacity={0.25}
            />
            <Tooltip
              formatter={(value) => [`${value} / 150`, '战力']}
              contentStyle={{
                background: '#111111',
                border: '1px solid #6E5626',
                borderRadius: 0,
                color: '#E8CF8A',
                fontSize: 13,
              }}
              labelStyle={{ color: '#D4AF37' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
