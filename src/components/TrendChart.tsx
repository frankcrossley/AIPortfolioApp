import { useState, type PointerEvent } from 'react'
import { formatPrice } from '../data/listings'

interface Point {
  month: string
  value: number
}

const W = 320
const H = 130
const PAD = { l: 34, r: 8, t: 10, b: 22 }

/** Single-series market price trend with a hover crosshair + tooltip. */
export default function TrendChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const values = data.map((d) => d.value)
  const step = 1000
  const min = Math.floor((Math.min(...values) * 0.94) / step) * step
  const max = Math.ceil((Math.max(...values) * 1.04) / step) * step
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step)
  const thin = ticks.length > 4 ? ticks.filter((_, i) => i % 2 === 0) : ticks

  const x = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r)
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(data.length - 1)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = ((e.clientX - rect.left) / rect.width) * (W - PAD.l - PAD.r)
    setHover(Math.max(0, Math.min(data.length - 1, Math.round((rel / (W - PAD.l - PAD.r)) * (data.length - 1)))))
  }

  const h = hover !== null ? data[hover] : null
  const kLabel = (v: number) => `£${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Average sale price over the last nine months">
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {thin.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e6e8eb" strokeWidth={1} />
            <text x={PAD.l - 6} y={y(t)} fontSize={9} fill="#6b7280" textAnchor="end" dominantBaseline="middle">
              {kLabel(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.month} x={x(i)} y={H - 6} fontSize={9} fill="#6b7280" textAnchor="middle">
              {d.month}
            </text>
          ) : null,
        )}
        <path d={area} fill="url(#trend-fill)" />
        <path d={line} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {h && hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(h.value)} r={4.5} fill="#2563eb" stroke="#fff" strokeWidth={2} />
          </>
        )}
        <rect
          x={PAD.l}
          y={0}
          width={W - PAD.l - PAD.r}
          height={H}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-[11px] whitespace-nowrap text-white shadow"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <span className="text-white/60">{h.month} · </span>
          <span className="font-semibold">{formatPrice(h.value)}</span>
        </div>
      )}
      <table className="sr-only">
        <caption>Average sale price by month</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <th>{d.month}</th>
              <td>{formatPrice(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
