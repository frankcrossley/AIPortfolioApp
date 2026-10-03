import type { Category, Condition } from '../data/listings'

/** Approximate new (RRP) prices in GBP used as the base for valuations. */
export const CATALOG: Record<string, Record<string, { rrp: number; category: Category }>> = {
  Specialized: {
    'S-Works Tarmac SL8': { rrp: 12000, category: 'road' },
    'S-Works Tarmac SL7': { rrp: 11000, category: 'road' },
    'Tarmac SL8 Expert': { rrp: 6500, category: 'road' },
    'S-Works Crux': { rrp: 11500, category: 'gravel' },
    'S-Works Epic': { rrp: 11000, category: 'mountain' },
    'S-Works Shiv': { rrp: 11000, category: 'tt' },
  },
  Trek: {
    'Madone SLR': { rrp: 11500, category: 'road' },
    'Émonda SLR 9': { rrp: 10000, category: 'road' },
    'Supercaliber SLR 9.9': { rrp: 11000, category: 'mountain' },
    'Checkpoint SLR 7': { rrp: 6800, category: 'gravel' },
  },
  Cervélo: {
    S5: { rrp: 11500, category: 'road' },
    R5: { rrp: 9500, category: 'road' },
    'Áspero-5': { rrp: 8500, category: 'gravel' },
    P5: { rrp: 12500, category: 'tt' },
  },
  Pinarello: {
    'Dogma F': { rrp: 13500, category: 'road' },
    'Dogma F12': { rrp: 11500, category: 'road' },
    'Grevil F': { rrp: 7000, category: 'gravel' },
  },
  Giant: {
    'TCR Advanced SL 0': { rrp: 9500, category: 'road' },
    'Propel Advanced SL 0': { rrp: 10500, category: 'road' },
    'Revolt Advanced Pro': { rrp: 6000, category: 'gravel' },
  },
  Canyon: {
    'Aeroad CFR': { rrp: 9000, category: 'road' },
    'Grail CF SLX 8': { rrp: 5500, category: 'gravel' },
    'Speedmax CFR': { rrp: 11000, category: 'tt' },
  },
  'Santa Cruz': {
    'Megatower CC': { rrp: 9800, category: 'mountain' },
    'Hightower CC': { rrp: 9000, category: 'mountain' },
  },
}

export const GROUPSETS: { name: string; factor: number }[] = [
  { name: 'Shimano Dura-Ace Di2', factor: 1 },
  { name: 'SRAM Red AXS', factor: 1 },
  { name: 'Campagnolo Super Record EPS', factor: 1.02 },
  { name: 'Shimano Ultegra Di2', factor: 0.86 },
  { name: 'SRAM Force AXS', factor: 0.84 },
  { name: 'Shimano 105 Di2', factor: 0.72 },
  { name: 'Shimano GRX Di2', factor: 0.82 },
  { name: 'SRAM X0 Eagle Transmission', factor: 0.95 },
]

export const CONDITIONS: { name: Condition | 'Fair'; factor: number; blurb: string }[] = [
  { name: 'Excellent', factor: 1, blurb: 'Like new, minimal signs of use' },
  { name: 'Great', factor: 0.92, blurb: 'Light marks, fully functional' },
  { name: 'Good', factor: 0.83, blurb: 'Visible wear, mechanically sound' },
  { name: 'Fair', factor: 0.7, blurb: 'Needs some work or parts' },
]

export const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019]
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '49cm', '52cm', '54cm', '56cm', '58cm', '61cm']

const CURRENT_YEAR = 2026

export interface ValuationInput {
  brand: string
  model: string
  year: number
  size: string
  groupset: string
  condition: string
}

export interface Valuation {
  low: number
  high: number
  mid: number
  comparables: number
  trend: { month: string; value: number }[]
}

const round50 = (n: number) => Math.round(n / 50) * 50

/** Deterministic hash so the same input always produces the same comparables count / trend noise. */
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) / 4294967295
}

export function estimate(input: ValuationInput): Valuation {
  const entry = CATALOG[input.brand]?.[input.model]
  const rrp = entry?.rrp ?? 6000
  const age = Math.max(0, CURRENT_YEAR - input.year)
  // Big drop on first sale, then roughly 11% a year, floored.
  const depreciation = Math.max(0.22, 0.54 * Math.pow(0.89, age))
  const g = GROUPSETS.find((x) => x.name === input.groupset)?.factor ?? 0.9
  const c = CONDITIONS.find((x) => x.name === input.condition)?.factor ?? 0.9
  const size = /^(54cm|56cm|M|L)$/.test(input.size) ? 1.02 : 0.97

  const mid = rrp * depreciation * g * c * size
  const seed = hash(`${input.brand}|${input.model}|${input.year}`)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const trend = months.map((month, i) => {
    const season = Math.sin(((i + 1) / months.length) * Math.PI) * 0.06
    const noise = (hash(`${seed}-${i}`) - 0.5) * 0.04
    return { month, value: round50(mid * (0.93 + season + noise + i * 0.006)) }
  })

  return {
    low: round50(mid * 0.96),
    high: round50(mid * 1.04),
    mid: round50(mid),
    comparables: 40 + Math.floor(seed * 120),
    trend,
  }
}
