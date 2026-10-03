import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Bike, Cog, Globe, PackageCheck, Search, ShieldCheck, ThumbsUp, TrendingUp } from 'lucide-react'
import BikeArt from '../components/BikeArt'
import ListingCard from '../components/ListingCard'
import { CATEGORIES, CATEGORY_TOTALS } from '../data/listings'
import { useStore } from '../lib/store'

function MountainScene() {
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d4652" />
          <stop offset="0.55" stopColor="#8d8f8c" />
          <stop offset="1" stopColor="#b9a98b" />
        </linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa2ab" />
          <stop offset="1" stopColor="#6c757f" />
        </linearGradient>
        <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c5560" />
          <stop offset="1" stopColor="#2f363e" />
        </linearGradient>
        <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b4a35" />
          <stop offset="1" stopColor="#201a14" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0e11" stopOpacity="0.88" />
          <stop offset="0.5" stopColor="#0b0e11" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0b0e11" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1440" height="760" fill="url(#sky)" />
      <circle cx="1120" cy="210" r="90" fill="#f4e6c8" opacity="0.25" />
      <path d="M0 420 L140 300 L230 360 L380 210 L470 290 L590 180 L720 310 L860 200 L980 280 L1110 150 L1230 260 L1340 190 L1440 250 V760 H0Z" fill="url(#far)" />
      <path d="M380 210 L420 250 L400 252 L440 280 L380 262Z M590 180 L630 225 L605 222 L640 258 L585 232Z M1110 150 L1150 200 L1120 196 L1165 240 L1100 205Z" fill="#e8ecef" opacity="0.7" />
      <path d="M0 500 L170 400 L300 470 L460 360 L600 450 L760 380 L900 470 L1060 390 L1200 460 L1340 400 L1440 440 V760 H0Z" fill="url(#mid)" />
      <path d="M0 600 C 200 560 360 610 560 580 S 900 540 1080 590 S 1340 620 1440 600 V760 H0Z" fill="url(#near)" />
      <path d="M0 690 C 300 650 600 700 900 670 S 1300 690 1440 680 V760 H0Z" fill="#15110d" />
      <rect width="1440" height="760" fill="url(#shade)" />
    </svg>
  )
}

const STATS = [
  { icon: TrendingUp, value: '5,200+', label: 'Bikes sold' },
  { icon: ThumbsUp, value: '98%', label: 'Positive reviews' },
  { icon: PackageCheck, value: '£4.8m+', label: 'Transactions' },
  { icon: Globe, value: 'UK & Europe', label: 'Trusted shipping' },
]

export default function Home() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { allListings } = useStore()
  const featured = allListings.filter((l) => l.verified && l.category !== 'components').slice(0, 8)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/buy?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-28 pt-28 text-white md:pb-40 md:pt-40">
        <MountainScene />
        <div className="pointer-events-none absolute -right-24 bottom-6 hidden w-[62%] max-w-[880px] opacity-95 lg:block">
          <BikeArt bare category="road" frameColor="#1c2128" accentColor="#cfd6de" brand="Revelo" className="w-full drop-shadow-2xl" />
        </div>
        <div className="container-x relative">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/80">PRE-OWNED. PERFORMANCE. TRUSTED.</p>
          <h1 className="mt-4 max-w-xl text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            The premium marketplace for used bikes.
          </h1>
          <p className="mt-6 max-w-md text-base text-white/85">
            Buy and sell high-end bikes with confidence. Verified listings, real valuations and secure transactions.
          </p>
          <form onSubmit={submit} className="mt-8 flex max-w-xl overflow-hidden rounded-xl bg-white p-1.5 shadow-xl">
            <label htmlFor="hero-search" className="sr-only">
              Search
            </label>
            <input
              id="hero-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bikes, frames, components…"
              className="min-w-0 flex-1 px-3 text-sm text-ink outline-none"
            />
            <button className="btn btn-primary !px-4" aria-label="Search">
              <Search size={17} />
            </button>
          </form>
        </div>
      </section>

      <section className="container-x relative z-10 -mt-14 md:-mt-20">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const Icon = c.id === 'components' ? Cog : Bike
            return (
              <Link
                key={c.id}
                to={`/buy/${c.id}`}
                className="group flex flex-col items-center rounded-xl border border-line bg-white px-4 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Icon size={38} strokeWidth={1.4} className="transition group-hover:scale-110" />
                <span className="mt-3 text-sm font-semibold">{c.label}</span>
                <span className="text-xs text-muted">
                  {CATEGORY_TOTALS[c.id].count.toLocaleString('en-GB')} {CATEGORY_TOTALS[c.id].unit}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-b border-line pb-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon size={26} strokeWidth={1.5} className="shrink-0 text-ink/70" />
              <div>
                <p className="text-lg font-bold leading-tight">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Fresh, verified listings</h2>
            <p className="mt-1 text-sm text-muted">Every bike checked for identity, ownership and spec.</p>
          </div>
          <Link to="/buy" className="hidden items-center gap-1 text-sm font-semibold hover:underline sm:inline-flex">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="container-x mt-20 grid gap-5 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white md:p-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60">FREE VALUATION</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">What's your bike worth?</h3>
          <p className="mt-3 max-w-sm text-sm text-white/75">
            An instant, data-driven valuation based on real market sales and current listings.
          </p>
          <Link to="/value" className="btn btn-light mt-6">
            Get a valuation <ArrowRight size={16} />
          </Link>
          <BikeArt
            bare
            category="gravel"
            frameColor="#5c6e58"
            accentColor="#d8cfa8"
            className="pointer-events-none absolute -bottom-8 -right-16 w-80 opacity-40"
          />
        </div>
        <div className="rounded-2xl border border-line bg-canvas p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted">BUY WITH CONFIDENCE</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">Protected from click to ride.</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              'Seller identity and bike ownership verified',
              'Funds held until the bike is received and checked',
              'Insured, tracked, bike-specific shipping',
              '7-day inspection window on every purchase',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="mt-px shrink-0 text-brand" /> {t}
              </li>
            ))}
          </ul>
          <Link to="/how-it-works" className="btn btn-outline mt-6">
            How it works
          </Link>
        </div>
      </section>
    </>
  )
}
