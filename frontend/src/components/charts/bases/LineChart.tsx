import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type LineConfig<T> = {
  dataKey: keyof T
  name?: string
  stroke?: string
  fill?: string
  strokeDasharray?: string
}

type LineChartProps<T> = {
  title: string
  data: T[]
  xKey: keyof T
  lines: LineConfig<T>[]
  heightClass?: string
}

export function LineChart<T extends Record<string, any>>({
  title,
  data,
  xKey,
  lines,
  heightClass,
}: LineChartProps<T>) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background p-4">
      <p className="mb-2 text-sm font-medium">{title}</p>

      <div className={heightClass ?? 'h-[260px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.2)"
            />
            <XAxis
              dataKey={xKey as string}
              tick={{ fontSize: 10 }}
              tickMargin={8}
              axisLine={{ stroke: 'rgba(148,163,184,0.7)' }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: 'rgba(148,163,184,0.7)' }}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{
                fontSize: 11,
              }}
            />
            {lines.map((line) => (
              <Line
                key={String(line.dataKey)}
                type="monotone"
                dataKey={line.dataKey as string}
                name={line.name}
                stroke={line.stroke}
                strokeWidth={2}
                strokeDasharray={line.strokeDasharray}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
