import { useId } from 'react'
import type { Category, Listing } from '../data/listings'

type Backdrop = Listing['backdrop']

interface Props {
  category: Category
  frameColor: string
  accentColor: string
  backdrop?: Backdrop
  label?: string
  brand?: string
  /** 0 = full side view; other values crop/zoom to imitate detail photos. */
  view?: number
  /** Draw only the bike, on a transparent background. */
  bare?: boolean
  className?: string
}

const BACKDROPS: Record<Backdrop, { from: string; to: string; floor: string }> = {
  wall: { from: '#8d8a84', to: '#5d5a55', floor: '#3e3c39' },
  studio: { from: '#eceae6', to: '#c9c6c0', floor: '#b3afa8' },
  night: { from: '#2b3138', to: '#14181c', floor: '#0c0f12' },
  concrete: { from: '#a9adb1', to: '#7b8085', floor: '#5b6065' },
}

/** Crop windows (x, y, w, h) on the 400x260 canvas used to fake gallery detail shots. */
const VIEWS = [
  '0 0 400 260',
  '120 120 140 91',
  '200 50 130 85',
  '40 100 150 98',
  '130 40 120 78',
  '230 100 140 91',
]

export default function BikeArt({ category, frameColor, accentColor, backdrop = 'studio', label, brand, view = 0, bare = false, className }: Props) {
  const uid = useId().replace(/:/g, '')
  const bg = BACKDROPS[backdrop]
  const light = backdrop === 'studio'
  const tyre = '#141414'

  const mtb = category === 'mountain'
  const tt = category === 'tt'
  const gravel = category === 'gravel'
  const wheelsOnly = category === 'components'

  const r = mtb ? 66 : 62
  const tyreW = mtb ? 11 : gravel ? 8 : 5
  const rimDepth = tt ? 22 : mtb ? 4 : gravel ? 9 : 15
  const rear = { x: 108, y: 186 }
  const front = { x: 292, y: 186 }
  const bb = { x: 186, y: 196 }
  const seatTop = mtb ? { x: 170, y: 118 } : { x: 166, y: 104 }
  const headTop = mtb ? { x: 262, y: 104 } : { x: 266, y: 100 }
  const headBot = mtb ? { x: 272, y: 136 } : { x: 274, y: 126 }
  const tube = mtb ? 11 : 9

  const wheel = (cx: number, cy: number, key: string, disc = false) => (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={tyre} strokeWidth={tyreW} />
      {disc ? (
        <circle cx={cx} cy={cy} r={r - tyreW / 2} fill="#1d1f22" />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r - tyreW / 2 - rimDepth / 2} fill="none" stroke="#1d1f22" strokeWidth={rimDepth} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            const inner = 5
            const outer = r - tyreW - rimDepth
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * inner}
                y1={cy + Math.sin(a) * inner}
                x2={cx + Math.cos(a + 0.18) * outer}
                y2={cy + Math.sin(a + 0.18) * outer}
                stroke="#9aa0a6"
                strokeWidth={0.8}
                opacity={0.7}
              />
            )
          })}
        </>
      )}
      <circle cx={cx} cy={cy} r={6} fill="#2a2d31" stroke="#6b7177" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={13} fill="none" stroke="#7d8389" strokeWidth={2} opacity={0.6} />
    </g>
  )

  return (
    <svg
      viewBox={VIEWS[view % VIEWS.length]}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ?? 'Bike photo'}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bg.from} />
          <stop offset="1" stopColor={bg.to} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#ffffff" stopOpacity={light ? 0.55 : 0.12} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`frame-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={frameColor} />
          <stop offset="0.5" stopColor={frameColor} />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <filter id={`noise-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" />
        </filter>
      </defs>

      {!bare && (
        <>
      <rect width="400" height="260" fill={`url(#bg-${uid})`} />
      {backdrop === 'wall' &&
        Array.from({ length: 6 }).map((_, row) => (
          <g key={row} stroke="#000" strokeOpacity="0.14" strokeWidth="1.2">
            <line x1="0" x2="400" y1={row * 38 + 20} y2={row * 38 + 20} />
            {Array.from({ length: 6 }).map((__, col) => (
              <line
                key={col}
                x1={col * 80 + (row % 2) * 40}
                x2={col * 80 + (row % 2) * 40}
                y1={row * 38 - 18}
                y2={row * 38 + 20}
              />
            ))}
          </g>
        ))}
      {backdrop === 'concrete' && (
        <g stroke="#000" strokeOpacity="0.1">
          <line x1="133" x2="133" y1="0" y2="232" />
          <line x1="266" x2="266" y1="0" y2="232" />
          <line x1="0" x2="400" y1="116" y2="116" />
        </g>
      )}
      <rect width="400" height="260" fill={`url(#glow-${uid})`} />
      <rect y="232" width="400" height="28" fill={bg.floor} />
      <rect width="400" height="260" filter={`url(#noise-${uid})`} opacity="0.9" />
      <ellipse cx="200" cy="250" rx="170" ry="7" fill="#000" opacity="0.28" />

        </>
      )}
      {wheelsOnly ? (
        <g transform="translate(0 -4)">
          {wheel(160, 190, 'w1')}
          {wheel(250, 182, 'w2')}
        </g>
      ) : (
        <g>
          {wheel(rear.x, rear.y, 'rear', tt)}
          {wheel(front.x, front.y, 'front')}

          {/* chainstay + seatstay */}
          <g stroke={`url(#frame-${uid})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={bb.x} y1={bb.y} x2={rear.x} y2={rear.y} strokeWidth={tube - 3} />
            <line x1={seatTop.x + 2} y1={seatTop.y + 10} x2={rear.x} y2={rear.y} strokeWidth={tube - 4} />
          </g>

          {/* drivetrain */}
          <circle cx={bb.x} cy={bb.y} r={mtb ? 15 : 21} fill="none" stroke="#2c2f33" strokeWidth={4} />
          <circle cx={bb.x} cy={bb.y} r={mtb ? 9 : 14} fill="#3a3e43" />
          <circle cx={rear.x} cy={rear.y} r={mtb ? 20 : 12} fill="none" stroke="#5b6167" strokeWidth={3} />
          <path
            d={`M ${bb.x} ${bb.y - (mtb ? 15 : 21)} L ${rear.x} ${rear.y - (mtb ? 20 : 12)} M ${bb.x} ${bb.y + (mtb ? 15 : 21)} L ${rear.x} ${rear.y + (mtb ? 20 : 12)}`}
            stroke="#4a4f55"
            strokeWidth={1.6}
          />
          <line x1={bb.x} y1={bb.y} x2={bb.x + 20} y2={bb.y + 30} stroke="#2a2d31" strokeWidth={6} strokeLinecap="round" />
          <rect x={bb.x + 12} y={bb.y + 29} width={20} height={4} rx={2} fill="#1b1d20" />

          {/* main triangle */}
          <g stroke={`url(#frame-${uid})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={bb.x} y1={bb.y} x2={seatTop.x} y2={seatTop.y} strokeWidth={tube} />
            <line x1={seatTop.x} y1={seatTop.y + 2} x2={headTop.x} y2={headTop.y + 3} strokeWidth={tube - 1} />
            <line x1={bb.x} y1={bb.y} x2={headBot.x} y2={headBot.y} strokeWidth={tube + (tt ? 4 : 2)} />
            <line x1={headTop.x} y1={headTop.y} x2={headBot.x} y2={headBot.y} strokeWidth={tube + 3} />
          </g>

          {/* down-tube branding */}
          <text
            fontSize={tt ? 12 : 11}
            fontWeight={800}
            fontStyle="italic"
            letterSpacing={1.5}
            fill={accentColor}
            transform={`translate(${bb.x + 14} ${bb.y - 14}) rotate(${(Math.atan2(headBot.y - bb.y, headBot.x - bb.x) * 180) / Math.PI})`}
            dominantBaseline="middle"
          >
            {(brand ?? '').toUpperCase().slice(0, 11)}
          </text>

          {/* fork */}
          {mtb ? (
            <g strokeLinecap="round">
              <line x1={headBot.x} y1={headBot.y} x2={front.x - 6} y2={front.y - 30} stroke="#2a2d31" strokeWidth={12} />
              <line x1={front.x - 6} y1={front.y - 30} x2={front.x} y2={front.y} stroke="#1a1c1f" strokeWidth={8} />
            </g>
          ) : (
            <path
              d={`M ${headBot.x} ${headBot.y} Q ${headBot.x + 10} ${(headBot.y + front.y) / 2} ${front.x} ${front.y}`}
              stroke={`url(#frame-${uid})`}
              strokeWidth={tube - 2}
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* rear shock for full suspension */}
          {mtb && (
            <g>
              <line x1={seatTop.x + 18} y1={seatTop.y + 40} x2={bb.x - 2} y2={bb.y - 30} stroke="#c9a227" strokeWidth={8} strokeLinecap="round" />
              <line x1={seatTop.x + 18} y1={seatTop.y + 40} x2={bb.x - 2} y2={bb.y - 30} stroke="#222" strokeWidth={3} strokeLinecap="round" />
            </g>
          )}

          {/* seatpost + saddle */}
          <line
            x1={seatTop.x}
            y1={seatTop.y}
            x2={seatTop.x - 6}
            y2={seatTop.y - (mtb ? 26 : 24)}
            stroke={mtb ? '#2a2d31' : frameColor}
            strokeWidth={tube - 2}
            strokeLinecap="round"
          />
          <path
            d={`M ${seatTop.x - 34} ${seatTop.y - 30} Q ${seatTop.x - 8} ${seatTop.y - 38} ${seatTop.x + 18} ${seatTop.y - 30} L ${seatTop.x + 16} ${seatTop.y - 25} Q ${seatTop.x - 10} ${seatTop.y - 26} ${seatTop.x - 32} ${seatTop.y - 25} Z`}
            fill="#141414"
          />

          {/* cockpit */}
          {mtb ? (
            <g strokeLinecap="round" stroke="#1d1f22" fill="none">
              <line x1={headTop.x} y1={headTop.y} x2={headTop.x + 12} y2={headTop.y - 6} strokeWidth={6} />
              <line x1={headTop.x + 4} y1={headTop.y - 10} x2={headTop.x + 20} y2={headTop.y - 4} strokeWidth={5} />
            </g>
          ) : tt ? (
            <g strokeLinecap="round" fill="none">
              <line x1={headTop.x} y1={headTop.y} x2={headTop.x + 8} y2={headTop.y - 6} stroke={frameColor} strokeWidth={8} />
              <line x1={headTop.x - 10} y1={headTop.y - 8} x2={headTop.x + 44} y2={headTop.y - 10} stroke="#1d1f22" strokeWidth={4} />
              <rect x={headTop.x - 14} y={headTop.y - 16} width={16} height={6} rx={3} fill="#1d1f22" />
            </g>
          ) : (
            <g strokeLinecap="round" fill="none" stroke="#1d1f22">
              <line x1={headTop.x} y1={headTop.y} x2={headTop.x + 20} y2={headTop.y - 5} strokeWidth={6} />
              <path
                d={`M ${headTop.x + 20} ${headTop.y - 5} q 14 0 14 12 q 0 16 -10 22 l -6 2`}
                strokeWidth={5}
                transform={gravel ? `rotate(-8 ${headTop.x + 20} ${headTop.y - 5})` : undefined}
              />
              <path d={`M ${headTop.x + 28} ${headTop.y - 4} l 4 16`} stroke="#3a3e43" strokeWidth={4} />
            </g>
          )}
        </g>
      )}
    </svg>
  )
}
