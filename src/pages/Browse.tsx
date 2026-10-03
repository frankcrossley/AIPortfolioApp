import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ListingCard from '../components/ListingCard'
import { CATEGORIES, formatPrice, type Category, type Listing } from '../data/listings'
import { useStore } from '../lib/store'

const SORTS = {
  relevant: 'Most relevant',
  newest: 'Newest first',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
} as const
type Sort = keyof typeof SORTS

const PRICE_MAX = 15000
const CONDITIONS = ['Excellent', 'Great', 'Good'] as const

function countBy(items: Listing[], key: (l: Listing) => string) {
  const m = new Map<string, number>()
  items.forEach((l) => m.set(key(l), (m.get(key(l)) ?? 0) + 1))
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <p className="mb-3 text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

function CheckList({
  options,
  selected,
  onToggle,
  limit = 5,
}: {
  options: [string, number][]
  selected: string[]
  onToggle: (v: string) => void
  limit?: number
}) {
  const [more, setMore] = useState(false)
  const shown = more ? options : options.slice(0, limit)
  return (
    <div className="space-y-2">
      {shown.map(([name, n]) => (
        <label key={name} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
          <input type="checkbox" checked={selected.includes(name)} onChange={() => onToggle(name)} className="size-4 accent-ink" />
          <span className="flex-1 truncate">{name}</span>
          <span className="text-xs text-muted">{n}</span>
        </label>
      ))}
      {options.length > limit && (
        <button onClick={() => setMore((m) => !m)} className="text-xs font-semibold text-blue-700 hover:underline">
          {more ? 'Show less' : `Show more (${options.length - limit})`}
        </button>
      )}
      {options.length === 0 && <p className="text-xs text-muted">No options</p>}
    </div>
  )
}

export default function Browse() {
  const { category } = useParams<{ category?: Category }>()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { allListings } = useStore()

  const q = params.get('q') ?? ''
  const [sort, setSort] = useState<Sort>('relevant')
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [modelQuery, setModelQuery] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [groupsets, setGroupsets] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [price, setPrice] = useState<[number, number]>([0, PRICE_MAX])
  const [drawer, setDrawer] = useState(false)

  const cat = CATEGORIES.find((c) => c.id === category)
  const inCategory = useMemo(() => allListings.filter((l) => !cat || l.category === cat.id), [allListings, cat])

  const results = useMemo(() => {
    const term = q.toLowerCase()
    const out = inCategory.filter((l) => {
      if (term && !`${l.brand} ${l.model} ${l.groupset} ${l.wheels} ${l.category}`.toLowerCase().includes(term)) return false
      if (brands.length && !brands.includes(l.brand)) return false
      if (models.length && !models.includes(l.model)) return false
      if (sizes.length && !sizes.includes(l.size)) return false
      if (groupsets.length && !groupsets.includes(l.groupset)) return false
      if (conditions.length && !conditions.includes(l.condition)) return false
      if (verifiedOnly && !l.verified) return false
      if (l.price < price[0] || (price[1] < PRICE_MAX && l.price > price[1])) return false
      return true
    })
    if (sort === 'newest') out.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') out.sort((a, b) => b.price - a.price)
    if (sort === 'relevant') out.sort((a, b) => Number(b.verified) - Number(a.verified) || b.views - a.views)
    return out
  }, [inCategory, q, brands, models, sizes, groupsets, conditions, verifiedOnly, price, sort])

  const brandOpts = countBy(inCategory, (l) => l.brand)
  const modelOpts = countBy(
    inCategory.filter((l) => !brands.length || brands.includes(l.brand)),
    (l) => l.model,
  ).filter(([m]) => m.toLowerCase().includes(modelQuery.toLowerCase()))
  const sizeOpts = [...new Set(inCategory.map((l) => l.size))].sort()
  const groupsetOpts = countBy(inCategory, (l) => l.groupset)

  const activeCount =
    brands.length + models.length + sizes.length + groupsets.length + conditions.length + Number(verifiedOnly) + Number(price[0] > 0 || price[1] < PRICE_MAX)

  const reset = () => {
    setBrands([])
    setModels([])
    setSizes([])
    setGroupsets([])
    setConditions([])
    setVerifiedOnly(false)
    setPrice([0, PRICE_MAX])
    if (q) setParams({})
  }

  const filters = (
    <div>
      <Section title="Category">
        <select
          className="field"
          value={category ?? ''}
          onChange={(e) => {
            setBrands([])
            setModels([])
            navigate(`/buy${e.target.value ? `/${e.target.value}` : ''}${q ? `?q=${encodeURIComponent(q)}` : ''}`)
          }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Section>
      <Section title="Brand">
        <CheckList options={brandOpts} selected={brands} onToggle={(v) => setBrands((b) => toggle(b, v))} />
      </Section>
      <Section title="Model">
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={modelQuery} onChange={(e) => setModelQuery(e.target.value)} placeholder="Search model…" className="field !py-2 !pl-8 text-xs" />
        </div>
        <CheckList options={modelOpts} selected={models} onToggle={(v) => setModels((m) => toggle(m, v))} />
      </Section>
      <Section title="Price">
        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-ink"
            style={{ left: `${(price[0] / PRICE_MAX) * 100}%`, right: `${100 - (price[1] / PRICE_MAX) * 100}%` }}
          />
          <input
            type="range"
            className="range"
            min={0}
            max={PRICE_MAX}
            step={250}
            value={price[0]}
            aria-label="Minimum price"
            onChange={(e) => setPrice(([, hi]) => [Math.min(Number(e.target.value), hi - 250), hi])}
          />
          <input
            type="range"
            className="range"
            min={0}
            max={PRICE_MAX}
            step={250}
            value={price[1]}
            aria-label="Maximum price"
            onChange={(e) => setPrice(([lo]) => [lo, Math.max(Number(e.target.value), lo + 250)])}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{formatPrice(price[0])}</span>
          <span>{price[1] >= PRICE_MAX ? `${formatPrice(PRICE_MAX)}+` : formatPrice(price[1])}</span>
        </div>
      </Section>
      <Section title="Frame size">
        <div className="flex flex-wrap gap-1.5">
          {sizeOpts.map((s) => (
            <button
              key={s}
              onClick={() => setSizes((x) => toggle(x, s))}
              className={`min-w-11 rounded-md border px-2 py-1.5 text-xs font-medium transition ${sizes.includes(s) ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink/40'}`}
            >
              {s.replace('cm', '')}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Groupset">
        <CheckList options={groupsetOpts} selected={groupsets} onToggle={(v) => setGroupsets((g) => toggle(g, v))} limit={4} />
      </Section>
      <Section title="Condition">
        <CheckList
          options={CONDITIONS.map((c) => [c, inCategory.filter((l) => l.condition === c).length])}
          selected={conditions}
          onToggle={(v) => setConditions((c) => toggle(c, v))}
        />
      </Section>
      <div className="py-5">
        <label className="flex cursor-pointer items-center justify-between text-sm font-semibold">
          Verified listings only
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="size-4 accent-ink" />
        </label>
      </div>
    </div>
  )

  return (
    <div className="container-x py-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cat?.plural ?? 'All bikes & parts'}</h1>
          <p className="mt-1 text-sm text-muted">
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {q && (
              <>
                {' '}
                for “{q}”{' '}
                <button onClick={() => setParams({})} className="ml-1 inline-flex items-center gap-0.5 text-ink underline">
                  clear <X size={12} />
                </button>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDrawer(true)} className="btn btn-outline !py-2 lg:hidden">
            <SlidersHorizontal size={15} /> Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
          <label className="hidden text-xs text-muted sm:block" htmlFor="sort">
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field !w-auto !py-2 text-xs font-medium">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          {activeCount > 0 && (
            <button onClick={reset} className="mb-4 text-xs font-semibold underline">
              Clear all filters ({activeCount})
            </button>
          )}
          {filters}
        </aside>

        <div>
          {results.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-xl border border-dashed border-line px-6 py-20 text-center">
              <p className="text-lg font-semibold">No bikes match those filters</p>
              <p className="mt-1 text-sm text-muted">Try widening your price range or removing a filter.</p>
              <button onClick={reset} className="btn btn-primary mt-5">
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-semibold">Filters</p>
              <button onClick={() => setDrawer(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
            <div className="flex gap-2 border-t border-line p-4">
              <button onClick={reset} className="btn btn-outline flex-1">
                Reset
              </button>
              <button onClick={() => setDrawer(false)} className="btn btn-primary flex-1">
                Show {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
