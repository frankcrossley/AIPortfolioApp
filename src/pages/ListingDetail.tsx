import { useEffect, useRef, useState, type FormEvent, type ReactNode, type TouchEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Gauge, MapPin, Ruler, ShieldCheck, Star, Truck, BadgeCheck, Award, X, Check } from 'lucide-react'
import ListingCard, { FavouriteButton, ListingArt, VerifiedBadge } from '../components/ListingCard'
import { CATEGORIES, formatPrice } from '../data/listings'
import { useStore } from '../lib/store'
import NotFound from './NotFound'

const TABS = ['Overview', 'Specification', 'Condition', 'History', 'Delivery', 'Seller'] as const
type Tab = (typeof TABS)[number]

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal aria-label={title}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl sm:max-w-md sm:rounded-2xl sm:pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="-m-2 p-2">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function ListingDetail() {
  const { id = '' } = useParams()
  const { allListings } = useStore()
  const navigate = useNavigate()
  const listing = allListings.find((l) => l.id === id)

  const [view, setView] = useState(0)
  const [tab, setTab] = useState<Tab>('Overview')
  const [modal, setModal] = useState<null | 'offer' | 'message' | 'finance'>(null)
  const [sent, setSent] = useState(false)
  const [offer, setOffer] = useState('')
  const [showBar, setShowBar] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)

  // Reset the gallery when moving between listings (e.g. via "Similar bikes").
  useEffect(() => {
    setView(0)
    setTab('Overview')
  }, [id])

  // On phones, show a sticky buy bar once the main buttons scroll out of view.
  useEffect(() => {
    const update = () => {
      const el = ctaRef.current
      setShowBar(!!el && el.getBoundingClientRect().bottom < 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [id])

  if (!listing) return <NotFound />

  const cat = CATEGORIES.find((c) => c.id === listing.category)!
  const similar = allListings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 4)
  const monthly = Math.round((listing.price * 1.099) / 24)

  const close = () => {
    setModal(null)
    setSent(false)
    setOffer('')
  }
  const VIEWS = 6
  const step = (d: number) => setView((v) => (v + d + VIEWS) % VIEWS)
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const facts = [
    { icon: Ruler, label: 'Size', value: listing.size },
    { icon: ShieldCheck, label: 'Condition', value: listing.condition },
    { icon: Gauge, label: 'Mileage', value: `~${listing.mileageKm.toLocaleString('en-GB')} km` },
    { icon: MapPin, label: 'Location', value: listing.location },
  ]

  const trust = [
    { icon: BadgeCheck, title: listing.verified ? 'Verified listing' : 'Verification pending', body: 'Identity, ownership and specs checked' },
    { icon: ShieldCheck, title: 'Protected purchase', body: 'Secure payment and 7-day inspection' },
    { icon: Truck, title: 'Professional shipping', body: 'Insured, tracked and bike-specific packaging' },
    { icon: Award, title: '12 month optional warranty', body: `From ${formatPrice(Math.round(listing.price * 0.038))}` },
  ]

  return (
    <div className="container-x pb-24 pt-4 md:py-8">
      <Link to={`/buy/${cat.id}`} className="-ml-1 inline-flex items-center gap-0.5 py-1 text-sm font-medium text-muted sm:hidden">
        <ChevronLeft size={18} /> {cat.plural}
      </Link>
      <nav className="hidden flex-wrap items-center gap-1.5 text-xs text-muted sm:flex" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={12} />
        <Link to={`/buy/${cat.id}`} className="hover:text-ink">{cat.plural}</Link>
        <ChevronRight size={12} />
        <Link to={`/buy/${cat.id}?q=${encodeURIComponent(listing.brand)}`} className="hover:text-ink">{listing.brand}</Link>
        <ChevronRight size={12} />
        <span className="text-ink">{listing.model}</span>
      </nav>

      <div className="mt-3 grid gap-6 sm:mt-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10 lg:gap-y-0">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-xl" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <ListingArt listing={listing} view={view} className="aspect-[4/3] w-full sm:aspect-[16/10]" />
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 sm:hidden" aria-hidden>
              {Array.from({ length: VIEWS }).map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === view ? 'w-4 bg-white' : 'w-1.5 bg-white/55'}`} />
              ))}
            </div>
            <button onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow sm:grid">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow sm:grid">
              <ChevronRight size={18} />
            </button>
            {listing.verified && <VerifiedBadge className="absolute left-3 top-3 !text-xs shadow" />}
            <FavouriteButton id={listing.id} className="absolute right-3 top-3 !size-9" />
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition sm:w-24 ${view === v ? 'ring-ink' : 'ring-transparent hover:ring-line'}`}
                aria-label={`Photo ${v + 1}`}
              >
                <ListingArt listing={listing} view={v} className="aspect-[4/3] w-full" />
                {v === 5 && listing.photos > 6 && (
                  <span className="absolute inset-0 grid place-items-center bg-black/55 text-sm font-semibold text-white">
                    +{listing.photos - 6}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {listing.brand} {listing.model}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {listing.year} · {listing.size} · {listing.groupset} · {listing.wheels}
          </p>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{formatPrice(listing.price)}</p>
              <p className="text-xs text-muted">
                RRP <span className="line-through">{formatPrice(listing.originalPrice)}</span>
              </p>
            </div>
            <FavouriteButton id={listing.id} className="!size-10 border border-line !shadow-none" />
          </div>
          <div ref={ctaRef} className="mt-5 space-y-2.5">
            <button onClick={() => navigate(`/checkout/${listing.id}`)} className="btn btn-primary w-full">
              Buy now
            </button>
            <button onClick={() => setModal('offer')} className="btn btn-outline w-full">
              Make an offer
            </button>
          </div>
          <button onClick={() => setModal('finance')} className="mx-auto mt-3 flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
            Get finance options — from {formatPrice(monthly)}/mo <ArrowRight size={13} />
          </button>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {trust.map((t) => (
              <li key={t.title} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <t.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-muted">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-canvas text-sm font-bold">{listing.seller.initials}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{listing.seller.name}</p>
                <p className="text-xs text-muted">{listing.seller.type}</p>
              </div>
              {listing.verified && <VerifiedBadge />}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.round(listing.seller.rating) ? 'fill-current' : ''} />
                ))}
              </span>
              <span className="font-semibold text-ink">{listing.seller.rating.toFixed(1)}</span> ({listing.seller.reviews} reviews)
            </p>
            <button onClick={() => setModal('message')} className="btn btn-outline mt-4 w-full">
              Message seller
            </button>
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <div className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0 lg:mt-8">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={(e) => {
                  setTab(t)
                  e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
                }}
                className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition ${tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm leading-relaxed text-ink/80">
            {tab === 'Overview' && (
              <>
                <p className="max-w-2xl">{listing.description}</p>
                <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {facts.map((f) => (
                    <div key={f.label}>
                      <f.icon size={20} strokeWidth={1.6} className="text-ink/70" />
                      <p className="mt-2 text-xs text-muted">{f.label}</p>
                      <p className="font-semibold text-ink">{f.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {tab === 'Specification' && (
              <dl className="grid max-w-2xl grid-cols-1 sm:grid-cols-2">
                {Object.entries(listing.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line py-3 sm:mr-6">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tab === 'Condition' && (
              <div className="max-w-2xl space-y-4">
                <p>
                  Rated <strong className="text-ink">{listing.condition}</strong> by the seller
                  {listing.verified ? ' and confirmed from detailed photos by the Revelo team.' : '. Verification is in progress.'}
                </p>
                <ul className="space-y-2">
                  {['Frame: no cracks, dents or repairs', 'Drivetrain: wear within tolerance', 'Wheels: true, bearings smooth', 'Cosmetic: light marks consistent with mileage'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'History' && (
              <ol className="max-w-2xl space-y-4 border-l border-line pl-5">
                <li><p className="font-semibold text-ink">Purchased new · {listing.year}</p><p>Original invoice provided to Revelo.</p></li>
                <li><p className="font-semibold text-ink">Last service</p><p>Full service including bleed and new chain, {Math.max(1, Math.round(listing.postedDaysAgo / 2))} months ago.</p></li>
                <li><p className="font-semibold text-ink">Listed on Revelo</p><p>{listing.postedDaysAgo === 0 ? 'Today' : `${listing.postedDaysAgo} days ago`} · {listing.views} views</p></li>
              </ol>
            )}
            {tab === 'Delivery' && (
              <div className="max-w-2xl space-y-3">
                <p>Shipped in a bike-specific box with insured, tracked courier. Typically delivered within 3–5 working days in the UK, 5–8 days to Europe.</p>
                <p>Prefer to collect? Arrange a viewing in {listing.location.split(',')[0]} with the seller — payment still goes through Revelo for protection.</p>
              </div>
            )}
            {tab === 'Seller' && (
              <p className="max-w-2xl">
                {listing.seller.name} is a {listing.seller.type.toLowerCase()} on Revelo since {listing.seller.memberSince}, rated{' '}
                {listing.seller.rating.toFixed(1)} from {listing.seller.reviews} reviews. Usually responds within a few hours.
              </p>
            )}
          </div>
        </div>

      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight">Similar bikes</h2>
          <div className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {similar.map((l) => (
              <div key={l.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur transition-transform duration-200 lg:hidden ${showBar ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">
              {listing.brand} {listing.model}
            </p>
            <p className="text-lg font-bold leading-tight">{formatPrice(listing.price)}</p>
          </div>
          <button tabIndex={showBar ? 0 : -1} onClick={() => setModal('offer')} className="btn btn-outline !px-4">
            Offer
          </button>
          <button tabIndex={showBar ? 0 : -1} onClick={() => navigate(`/checkout/${listing.id}`)} className="btn btn-primary !px-5">
            Buy now
          </button>
        </div>
      </div>

      {modal === 'offer' && (
        <Modal title="Make an offer" onClose={close}>
          {sent ? (
            <p className="text-sm">
              Your offer of <strong>{formatPrice(Number(offer))}</strong> has been sent to {listing.seller.name}. You'll be notified when they respond — offers expire after 48 hours.
            </p>
          ) : (
            <form onSubmit={send} className="space-y-4">
              <p className="text-sm text-muted">Asking price {formatPrice(listing.price)}. Offers below 70% are automatically declined.</p>
              <div>
                <label className="label" htmlFor="offer">Your offer (£)</label>
                <input
                  id="offer"
                  type="number"
                  inputMode="numeric"
                  required
                  min={Math.round(listing.price * 0.7)}
                  max={listing.price}
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="field"
                  placeholder={String(Math.round(listing.price * 0.92))}
                />
              </div>
              <button className="btn btn-primary w-full">Send offer</button>
            </form>
          )}
        </Modal>
      )}
      {modal === 'message' && (
        <Modal title={`Message ${listing.seller.name}`} onClose={close}>
          {sent ? (
            <p className="text-sm">Message sent. {listing.seller.name} usually replies within a few hours.</p>
          ) : (
            <form onSubmit={send} className="space-y-4">
              <textarea required rows={4} className="field" defaultValue={`Hi ${listing.seller.name.split(' ')[0]}, is the ${listing.model} still available?`} />
              <p className="text-xs text-muted">For your protection, keep all payments on Revelo.</p>
              <button className="btn btn-primary w-full">Send message</button>
            </form>
          )}
        </Modal>
      )}
      {modal === 'finance' && (
        <Modal title="Finance options" onClose={close}>
          <div className="space-y-3 text-sm">
            {[12, 24, 36].map((m) => (
              <div key={m} className="flex items-center justify-between rounded-lg border border-line p-3">
                <span>{m} months</span>
                <span className="font-semibold">{formatPrice(Math.round((listing.price * (1 + 0.0495 * (m / 12))) / m))}/mo</span>
              </div>
            ))}
            <p className="text-xs text-muted">Representative 9.9% APR. Illustrative only — subject to status.</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
