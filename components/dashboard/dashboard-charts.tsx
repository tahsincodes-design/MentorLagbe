import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardAnalytics } from "@/lib/tuitions/analytics"

type Segment = { label: string; value: number; color: string }
type Month = DashboardAnalytics["months"][number]
type Series = {
  key: Exclude<keyof Month, "month">
  label: string
  color: string
  dash?: string
}

export const chartColors = {
  positive: "#25967a",
  negative: "#d75d70",
  pending: "#c38926",
  activity: "#5477d7",
}

const number = new Intl.NumberFormat("en")
const monthLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
})

export function OutcomeChart({
  title,
  description,
  segments,
  rateLabel,
}: {
  title: string
  description: string
  segments: Segment[]
  rateLabel: string
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const accepted = segments[0].value
  const decided = accepted + segments[1].value
  let start = 0
  const stops = segments
    .filter(({ value }) => value > 0)
    .map(({ color, value }) => {
      const stop = start + (value / total) * 100
      const segment = `${color} ${start}% ${stop}%`
      start = stop
      return segment
    })

  return (
    <Card className="card-elevation">
      <CardHeader>
        <CardTitle className="font-bold">
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <div
            className="relative grid size-32 shrink-0 place-items-center rounded-full bg-muted"
            style={
              total
                ? { backgroundImage: `conic-gradient(${stops.join(", ")})` }
                : undefined
            }
          >
            <div className="grid size-24 place-content-center rounded-full bg-card text-center">
              <p className="text-2xl font-extrabold tabular-nums">
                {number.format(total)}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <ul className="min-w-32 flex-1 space-y-2 text-sm">
            {segments.map(({ label, value, color }) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-muted-foreground">{label}</span>
                <span className="ml-auto font-semibold tabular-nums">
                  {number.format(value)}
                </span>
                <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                  {total ? `${Math.round((value / total) * 100)}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 border-t pt-3 text-sm">
          {rateLabel}{" "}
          <strong>
            {decided ? `${Math.round((accepted / decided) * 100)}%` : "—"}
          </strong>
          <span className="ml-2 text-xs text-muted-foreground">
            {decided
              ? `of ${number.format(decided)} decided`
              : "No decisions yet"}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

export function ActivityChart({
  months,
  series,
}: {
  months: Month[]
  series: Series[]
}) {
  const highest = Math.max(
    1,
    ...months.flatMap((month) => series.map(({ key }) => month[key]))
  )
  const step = Math.ceil(highest / 4)
  const max = step * 4
  const width = 620
  const left = 52
  const right = 600
  const top = 18
  const bottom = 168
  const x = (index: number) =>
    left + (index * (right - left)) / Math.max(months.length - 1, 1)
  const y = (value: number) => bottom - (value / max) * (bottom - top)
  const labels = months.map(({ month }) =>
    monthLabel.format(new Date(`${month}-01T00:00:00Z`))
  )

  return (
    <Card className="card-elevation">
      <CardHeader>
        <CardTitle className="font-bold">
          <h2>Monthly activity</h2>
        </CardTitle>
        <CardDescription>
          Last six calendar months in Dhaka. Decisions appear in the month of
          their latest status update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {series.map(({ color, dash, label, key }) => (
            <li key={key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-5 border-t-2"
                style={{
                  borderColor: color,
                  borderStyle: dash ? "dashed" : "solid",
                }}
              />
              {label}
            </li>
          ))}
        </ul>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} 200`}
            className="w-full min-w-96"
            role="img"
            aria-label="Line chart of monthly activity. Exact counts are available in the table below."
          >
            {[0, 1, 2, 3, 4].map((tick) => (
              <g key={tick}>
                <path
                  d={`M ${left} ${y(tick * step)} H ${right}`}
                  className="stroke-border"
                />
                <text
                  x={left - 8}
                  y={y(tick * step) + 5}
                  textAnchor="end"
                  className="fill-muted-foreground text-[15px]"
                >
                  {tick * step}
                </text>
              </g>
            ))}
            {labels.map((label, index) => (
              <text
                key={months[index].month}
                x={x(index)}
                y={192}
                textAnchor="middle"
                className="fill-muted-foreground text-base"
              >
                {label}
              </text>
            ))}
            {series.map(({ key, color, dash }) => (
              <polyline
                key={key}
                points={months
                  .map((month, index) => `${x(index)},${y(month[key])}`)
                  .join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeDasharray={dash}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        </div>
        <details className="mt-3 border-t pt-3">
          <summary className="w-fit cursor-pointer rounded-sm text-sm font-medium text-muted-foreground focus-visible:outline-2">
            View monthly counts
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="p-2">
                    Month
                  </th>
                  {series.map(({ key, label }) => (
                    <th key={key} scope="col" className="p-2 text-right">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={month.month} className="border-b last:border-0">
                    <th scope="row" className="p-2 font-medium">
                      {labels[index]} {month.month.slice(0, 4)}
                    </th>
                    {series.map(({ key }) => (
                      <td key={key} className="p-2 text-right tabular-nums">
                        {number.format(month[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
