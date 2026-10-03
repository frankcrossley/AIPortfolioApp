import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BadgeCheck, Camera, Check, CircleDollarSign, ListChecks, Lock, SearchCheck, Upload, X } from 'lucide-react'
import BikeArt from '../components/BikeArt'
import { formatPrice, type Category, type Condition, type Listing } from '../data/listings'
import { CATALOG, CONDITIONS, GROUPSETS, SIZES, YEARS, estimate } from '../lib/valuation'
import { useStore } from '../lib/store'

const STEPS = [
  { title: 'Basic details', body: 'Tell us about your bike' },
  { title: 'Photos', body: 'Upload photos and key details' },
  { title: 'Get valuation', body: 'See recommended price' },
  { title: 'List your bike', body: 'Go live on the marketplace' },
]

const COLOURS = ['#1c2128', '#e9e6df', '#0f2a44', '#7a1f1f', '#5c6e58', '#9a7b56', '#38b2ac', '#2a2440']

interface Draft {
  brand: string
  model: string
  year: number
  size: string
  groupset: string
  wheels: string
  condition: Condition
  mileageKm: number
  location: string
  description: string
  frameColor: string
  price: number
}

function StepRail({ current, onPick }: { current: number; onPick?: (i: number) => void }) {
  return (
    <ol className="space-y-6">
      {STEPS.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s.title}>
            <button
              type="button"
              disabled={!onPick || i > current}
              onClick={() => onPick?.(i)}
              className="flex items-start gap-4 text-left disabled:cursor-default"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  done ? 'bg-brand text-white' : active || !onPick ? 'bg-ink text-white' : 'border border-line text-muted'
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span>
                <span className={`block font-semibold ${!onPick || active || done ? 'text-ink' : 'text-muted'}`}>{s.title}</span>
                <span className="text-sm text-muted">{s.body}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="container-x py-10 md:py-16">
      <div className="grid overflow-hidden rounded-2xl border border-line md:grid-cols-[1fr_1.1fr]">
        <div className="p-8 md:p-12">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted">SELL YOUR BIKE</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Sell faster, for a fair price.</h1>
          <p className="mt-3 max-w-md text-muted">List in minutes. We verify, value and protect the sale — you get paid as soon as the buyer confirms.</p>
          <div className="mt-8">
            <StepRail current={-1} />
          </div>
          <button onClick={onStart} className="btn btn-primary mt-8 w-full sm:w-auto sm:px-16">
            Start selling
          </button>
          <ul className="mt-8 grid gap-3 text-sm text-ink/80 sm:grid-cols-2">
            {[
              [CircleDollarSign, 'Free valuation'],
              [ListChecks, 'Guided listing flow'],
              [SearchCheck, 'Optional professional inspection'],
              [Lock, 'Secure payments'],
            ].map(([Icon, t]) => {
              const I = Icon as typeof Lock
              return (
                <li key={t as string} className="flex items-center gap-2.5">
                  <I size={18} strokeWidth={1.6} /> {t as string}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="relative min-h-80 bg-ink">
          <BikeArt category="road" frameColor="#16181c" accentColor="#9aa4b1" backdrop="night" brand="Cervélo" className="absolute inset-0 size-full" />
          <div className="absolute inset-x-6 bottom-6 rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur md:inset-x-auto md:right-6 md:w-72">
            <p className="font-semibold leading-snug">“Sold in 9 days for £5,300. The process was seamless.”</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-canvas text-xs font-bold">TR</span>
              <div>
                <p className="text-sm font-semibold">Tom R.</p>
                <p className="flex items-center gap-1 text-xs text-brand">
                  <BadgeCheck size={12} /> Verified seller
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sell() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { addUserListing } = useStore()
  const prefilled = params.has('brand')

  const [started, setStarted] = useState(prefilled)
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [d, setD] = useState<Draft>(() => {
    const brand = params.get('brand') && CATALOG[params.get('brand')!] ? params.get('brand')! : 'Specialized'
    const models = Object.keys(CATALOG[brand])
    const model = params.get('model') && models.includes(params.get('model')!) ? params.get('model')! : models[0]
    return {
      brand,
      model,
      year: Number(params.get('year')) || 2023,
      size: params.get('size') ?? '56cm',
      groupset: params.get('groupset') ?? GROUPSETS[0].name,
      wheels: '',
      condition: (params.get('condition') as Condition) ?? 'Excellent',
      mileageKm: 3000,
      location: 'London, UK',
      description: '',
      frameColor: COLOURS[0],
      price: Number(params.get('price')) || 0,
    }
  })

  // Revoke preview URLs only when leaving the page; individual removals revoke their own.
  const photosRef = useRef(photos)
  photosRef.current = photos
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p)), [])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))
  const category: Category = CATALOG[d.brand]?.[d.model]?.category ?? 'road'
  const val = useMemo(() => estimate(d), [d])
  const price = d.price || val.mid

  if (!started) return <Intro onStart={() => setStarted(true)} />

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      if (step === 1 && !d.price) set('price', val.mid)
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const listing: Listing = {
      id: `my-${Date.now().toString(36)}`,
      brand: d.brand,
      model: d.model,
      category,
      year: d.year,
      size: d.size,
      groupset: d.groupset,
      wheels: d.wheels || 'Stock wheels',
      price,
      originalPrice: CATALOG[d.brand]?.[d.model]?.rrp ?? price * 2,
      condition: d.condition,
      location: d.location,
      verified: false,
      mileageKm: d.mileageKm,
      frameColor: d.frameColor,
      accentColor: '#cfd6de',
      backdrop: 'studio',
      photos: Math.max(6, photos.length),
      postedDaysAgo: 0,
      views: 0,
      seller: { name: 'Frank C.', initials: 'FC', rating: 5, reviews: 3, type: 'Private seller', memberSince: 2024 },
      description:
        d.description ||
        `${d.year} ${d.brand} ${d.model} in ${d.condition.toLowerCase()} condition with ${d.groupset}. Approximately ${d.mileageKm.toLocaleString('en-GB')} km ridden.`,
      specs: {
        Brand: d.brand,
        Model: d.model,
        Year: String(d.year),
        'Frame size': d.size,
        Groupset: d.groupset,
        Wheels: d.wheels || 'Stock wheels',
        'Approx. mileage': `${d.mileageKm.toLocaleString('en-GB')} km`,
      },
    }
    addUserListing(listing)
    navigate(`/listing/${listing.id}`)
  }

  return (
    <div className="container-x py-10">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <StepRail current={step} onPick={setStep} />
        </aside>

        <form onSubmit={next} className="max-w-2xl">
          <p className="text-xs font-semibold text-muted lg:hidden">
            Step {step + 1} of 4
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{STEPS[step].title}</h1>
          <p className="mt-1 text-muted">{STEPS[step].body}</p>

          {step === 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="s-brand">Brand</label>
                <select id="s-brand" className="field" value={d.brand} onChange={(e) => setD((x) => ({ ...x, brand: e.target.value, model: Object.keys(CATALOG[e.target.value])[0], price: 0 }))}>
                  {Object.keys(CATALOG).map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="s-model">Model</label>
                <select id="s-model" className="field" value={d.model} onChange={(e) => setD((x) => ({ ...x, model: e.target.value, price: 0 }))}>
                  {Object.keys(CATALOG[d.brand]).map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="s-year">Year</label>
                <select id="s-year" className="field" value={d.year} onChange={(e) => setD((x) => ({ ...x, year: Number(e.target.value), price: 0 }))}>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="s-size">Frame size</label>
                <select id="s-size" className="field" value={d.size} onChange={(e) => set('size', e.target.value)}>
                  {SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="s-group">Groupset</label>
                <select id="s-group" className="field" value={d.groupset} onChange={(e) => setD((x) => ({ ...x, groupset: e.target.value, price: 0 }))}>
                  {GROUPSETS.map((g) => <option key={g.name}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="s-wheels">Wheels</label>
                <input id="s-wheels" className="field" placeholder="e.g. Roval Rapide CLX" value={d.wheels} onChange={(e) => set('wheels', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <span className="label">Condition</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {CONDITIONS.slice(0, 3).map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setD((x) => ({ ...x, condition: c.name as Condition, price: 0 }))}
                      className={`rounded-lg border p-3 text-left transition ${d.condition === c.name ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-ink/40'}`}
                    >
                      <span className="block text-sm font-semibold">{c.name}</span>
                      <span className="text-xs text-muted">{c.blurb}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="s-km">Approx. mileage (km)</label>
                <input id="s-km" type="number" min={0} className="field" value={d.mileageKm} onChange={(e) => set('mileageKm', Number(e.target.value))} />
              </div>
              <div>
                <label className="label" htmlFor="s-loc">Location</label>
                <input id="s-loc" required className="field" value={d.location} onChange={(e) => set('location', e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 space-y-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-canvas px-6 py-10 text-center transition hover:border-ink/40">
                <Upload size={26} className="text-ink/60" />
                <span className="mt-3 font-semibold">Upload photos</span>
                <span className="text-sm text-muted">Drive side, non-drive side, cockpit, drivetrain, serial number. JPG or PNG.</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = [...(e.target.files ?? [])].map((f) => URL.createObjectURL(f))
                    setPhotos((p) => [...p, ...files].slice(0, 20))
                  }}
                />
              </label>
              {photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {photos.map((p, i) => (
                    <div key={p} className="relative aspect-square overflow-hidden rounded-lg">
                      <img src={p} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(p)
                          setPhotos((ps) => ps.filter((x) => x !== p))
                        }}
                        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white"
                        aria-label="Remove photo"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Camera size={14} /> No photos yet — you can add them later; we'll show a preview render in the meantime.
                </p>
              )}
              <div>
                <span className="label">Frame colour</span>
                <div className="flex flex-wrap gap-2">
                  {COLOURS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => set('frameColor', c)}
                      className={`size-8 rounded-full ring-2 ring-offset-2 ${d.frameColor === c ? 'ring-ink' : 'ring-transparent'}`}
                      style={{ background: c }}
                      aria-label={`Colour ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="s-desc">Description</label>
                <textarea
                  id="s-desc"
                  rows={5}
                  className="field"
                  placeholder="Service history, upgrades, reason for selling, anything included…"
                  value={d.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 rounded-2xl border border-line p-6">
              <p className="text-sm text-muted">Recommended price range</p>
              <p className="text-3xl font-bold text-brand">
                {formatPrice(val.low)} – {formatPrice(val.high)}
              </p>
              <p className="mt-1 text-sm text-muted">Based on {val.comparables} comparable sales and current listings.</p>
              <label className="label mt-6" htmlFor="s-price">Your asking price</label>
              <div className="flex items-center gap-4">
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">£</span>
                  <input id="s-price" type="number" min={50} required className="field !pl-7" value={price} onChange={(e) => set('price', Number(e.target.value))} />
                </div>
                <span
                  className={`text-xs font-semibold ${price > val.high * 1.05 ? 'text-amber-600' : price < val.low * 0.95 ? 'text-blue-700' : 'text-brand'}`}
                >
                  {price > val.high * 1.05 ? 'Above market — may take longer to sell' : price < val.low * 0.95 ? 'Below market — likely a quick sale' : 'Priced to sell'}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(val.low * 0.7)}
                max={Math.round(val.high * 1.3)}
                step={50}
                value={price}
                onChange={(e) => set('price', Number(e.target.value))}
                className="mt-5 w-full accent-ink"
                aria-label="Asking price"
              />
              <p className="mt-4 text-xs text-muted">
                Revelo fee 6% · you receive <strong className="text-ink">{formatPrice(Math.round(price * 0.94))}</strong>
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              {photos[0] ? (
                <img src={photos[0]} alt="Main" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <BikeArt category={category} frameColor={d.frameColor} accentColor="#cfd6de" backdrop="studio" brand={d.brand} className="aspect-[16/9] w-full" />
              )}
              <div className="p-6">
                <p className="text-xl font-bold">
                  {d.brand} {d.model}
                </p>
                <p className="text-sm text-muted">
                  {d.year} · {d.size} · {d.groupset} · {d.condition} · {d.location}
                </p>
                <p className="mt-3 text-2xl font-bold">{formatPrice(price)}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {['Our team reviews your listing within 24 hours', 'Free verification badge once identity and ownership are confirmed', 'Get paid when the buyer confirms receipt'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand" /> {t}
                    </li>
                  ))}
                </ul>
                <label className="mt-5 flex items-start gap-2 text-xs text-muted">
                  <input type="checkbox" required className="mt-0.5 accent-ink" /> I confirm I own this bike and the details above are accurate.
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">
                Back
              </button>
            )}
            <button className="btn btn-primary flex-1 sm:flex-none sm:px-12">{step === 3 ? 'Publish listing' : 'Continue'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
