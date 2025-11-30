import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type BarChartProps<T> = {
  title: string
  data: T[]
  xKey: keyof T
  valueKey: keyof T
  valueLabel?: string
  fill?: string
  heightClass?: string
}

export function BarChart<T extends Record<string, any>>({
  title,
  data,
  xKey,
  valueKey,
  valueLabel,
  fill = '#25a9e0',
  heightClass,
}: BarChartProps<T>) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
      <p className="mb-2 text-sm font-medium">{title}</p>

      <div className={heightClass ?? 'h-[260px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data}>
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
            <Bar
              dataKey={valueKey as string}
              name={valueLabel}
              fill={fill}
              radius={[6, 6, 0, 0]}
            />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
