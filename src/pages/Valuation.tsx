import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import TrendChart from '../components/TrendChart'
import { ListingArt } from '../components/ListingCard'
import BikeArt from '../components/BikeArt'
import { formatPrice } from '../data/listings'
import { CATALOG, CONDITIONS, GROUPSETS, SIZES, YEARS, estimate, type ValuationInput } from '../lib/valuation'
import { useStore } from '../lib/store'

const DEFAULT: ValuationInput = {
  brand: 'Specialized',
  model: 'S-Works Tarmac SL8',
  year: 2024,
  size: '54cm',
  groupset: 'Shimano Dura-Ace Di2',
  condition: 'Excellent',
}

function Select({ label, value, onChange, options }: { label: string; value: string | number; onChange: (v: string) => void; options: (string | number)[] }) {
  const id = `val-${label.toLowerCase().replace(/\s/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-white/70">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function Valuation() {
  const [form, setForm] = useState<ValuationInput>(DEFAULT)
  const [submitted, setSubmitted] = useState<ValuationInput>(DEFAULT)
  const { allListings } = useStore()

  const result = useMemo(() => estimate(submitted), [submitted])
  const meta = CATALOG[submitted.brand]?.[submitted.model]
  const similar = useMemo(
    () =>
      allListings
        .filter((l) => l.category === (meta?.category ?? 'road'))
        .sort((a, b) => Math.abs(a.price - result.mid) - Math.abs(b.price - result.mid))
        .slice(0, 3),
    [allListings, meta, result.mid],
  )

  const set = <K extends keyof ValuationInput>(k: K, v: ValuationInput[K]) => setForm((f) => ({ ...f, [k]: v }))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(form)
  }
  const dirty = JSON.stringify(form) !== JSON.stringify(submitted)

  const sellParams = new URLSearchParams({
    brand: submitted.brand,
    model: submitted.model,
    year: String(submitted.year),
    size: submitted.size,
    groupset: submitted.groupset,
    condition: submitted.condition,
    price: String(result.mid),
  })

  return (
    <>
      <section className="bg-ink pb-16 pt-28 text-white md:pb-24 md:pt-36">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
          <form onSubmit={submit}>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">What's your bike worth?</h1>
            <p className="mt-4 max-w-md text-white/75">
              Get an instant, data-driven valuation based on real market sales and current listings.
            </p>
            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
              <Select
                label="Brand"
                value={form.brand}
                options={Object.keys(CATALOG)}
                onChange={(v) => setForm((f) => ({ ...f, brand: v, model: Object.keys(CATALOG[v])[0] }))}
              />
              <Select label="Model" value={form.model} options={Object.keys(CATALOG[form.brand])} onChange={(v) => set('model', v)} />
              <Select label="Year" value={form.year} options={YEARS} onChange={(v) => set('year', Number(v))} />
              <Select label="Frame size" value={form.size} options={SIZES} onChange={(v) => set('size', v)} />
              <Select label="Groupset" value={form.groupset} options={GROUPSETS.map((g) => g.name)} onChange={(v) => set('groupset', v)} />
              <Select label="Condition" value={form.condition} options={CONDITIONS.map((c) => c.name)} onChange={(v) => set('condition', v)} />
            </div>
            <p className="mt-3 max-w-xl text-xs text-white/50">
              {CONDITIONS.find((c) => c.name === form.condition)?.blurb}
            </p>
            <button className="btn btn-light mt-6 w-full max-w-xl !py-3.5">{dirty ? 'Update valuation' : 'Get valuation'}</button>
          </form>

          <div className="rounded-2xl bg-white p-6 text-ink shadow-2xl" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className="w-28 shrink-0 overflow-hidden rounded-lg">
                <BikeArt
                  category={meta?.category ?? 'road'}
                  frameColor="#1c2128"
                  accentColor="#5aa9e6"
                  backdrop="studio"
                  brand={submitted.brand}
                  className="aspect-[4/3] w-full"
                />
              </div>
              <div>
                <p className="font-semibold leading-tight">
                  {submitted.brand} {submitted.model}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {submitted.year} · {submitted.size} · {submitted.groupset}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted">Estimated value</p>
            <p className="text-3xl font-bold text-brand md:text-4xl">
              {formatPrice(result.low)} – {formatPrice(result.high)}
            </p>
            <p className="mt-1 text-sm text-muted">
              Based on {result.comparables} comparable sales and current listings.
            </p>

            <p className="mb-3 mt-6 text-xs font-semibold text-ink/70">Average sale price, last 9 months</p>
            <TrendChart data={result.trend} />

            <p className="mb-3 mt-6 text-xs font-semibold text-ink/70">Similar bikes currently listed</p>
            <div className="grid grid-cols-3 gap-3">
              {similar.map((l) => (
                <Link key={l.id} to={`/listing/${l.id}`} className="group">
                  <div className="overflow-hidden rounded-lg">
                    <ListingArt listing={l} className="aspect-[4/3] w-full transition group-hover:scale-105" />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold">{formatPrice(l.price)}</p>
                </Link>
              ))}
            </div>

            <Link to={`/sell?${sellParams}`} className="btn btn-primary mt-6 w-full">
              List it for {formatPrice(result.mid)} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x mt-16 grid gap-8 md:grid-cols-3">
        {[
          ['Real sales data', 'We combine completed Revelo sales with live listings across the market, weighted towards the most recent.'],
          ['Spec-aware', 'Groupset, wheels, frame size and age all shift value. Popular sizes (54–56cm, M/L) sell faster and for more.'],
          ['Condition matters', 'An Excellent-condition bike typically commands 15–20% more than one in Good condition.'],
        ].map(([t, b]) => (
          <div key={t}>
            <Info size={20} className="text-ink/60" />
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted">{b}</p>
          </div>
        ))}
      </section>
    </>
  )
}
