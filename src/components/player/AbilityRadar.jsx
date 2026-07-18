import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// 将帅能力罗盘：统一六维（统帅 Rating / 杀伤 ADR / 战功 RWS / 常胜 胜率 / 位列 段位 / 夺魁 MVP）
// radar 条目结构：{ subject, value, fullMark, raw }；value 为 null 表示该平台无此数据
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
              connectNulls
            />
            <Tooltip
              formatter={(value, _name, item) => [
                value == null ? '暂无数据' : `${item.payload.raw}`,
                item.payload.metric,
              ]}
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
      <p className="mt-1 text-center text-[11px] text-neutral-600">
        悬停查看原始数值 · 缺数据的维度以虚位显示
      </p>
    </div>
  )
}
