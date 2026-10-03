import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, CreditCard, Lock, ShieldCheck } from 'lucide-react'
import { ListingArt } from '../components/ListingCard'
import { formatPrice } from '../data/listings'
import { useStore, type Order } from '../lib/store'
import NotFound from './NotFound'

const STEPS = ['Shipping', 'Payment', 'Review', 'Complete']
const REGIONS = { UK: 95, Europe: 165, Other: 290 } as const
type Region = keyof typeof REGIONS

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-start">
      {STEPS.map((s, i) => (
        <li key={s} className="relative flex flex-1 flex-col items-center">
          {i > 0 && <span className={`absolute right-1/2 top-4 h-px w-full ${i <= step ? 'bg-ink' : 'bg-line'}`} />}
          <span
            className={`relative grid size-8 place-items-center rounded-full border text-xs font-semibold ${
              i < step ? 'border-ink bg-ink text-white' : i === step ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted'
            }`}
          >
            {i < step ? <Check size={14} /> : i + 1}
          </span>
          <span className={`mt-2 text-xs ${i <= step ? 'text-ink' : 'text-muted'}`}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

export default function Checkout() {
  const { id = '' } = useParams()
  const { allListings, placeOrder } = useStore()
  const listing = allListings.find((l) => l.id === id)

  const [step, setStep] = useState(0)
  const [region, setRegion] = useState<Region>('UK')
  const [addr, setAddr] = useState({ name: 'Frank Crossley', line1: '12 High Street', city: 'London', postcode: 'E1 6AN', email: '' })
  const [inspection, setInspection] = useState(true)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [order, setOrder] = useState<Order | null>(null)

  if (!listing) return <NotFound />

  const shipping = REGIONS[region]
  const protection = Math.round(listing.price * 0.03)
  const inspectionFee = inspection ? 79 : 0
  const total = listing.price + shipping + protection + inspectionFee

  const next = (e: FormEvent) => {
    e.preventDefault()
    if (step === 2) {
      setOrder(placeOrder({ listingId: listing.id, total, name: addr.name, city: addr.city }))
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const field = (key: keyof typeof addr, label: string, opts: { type?: string; half?: boolean } = {}) => (
    <div className={opts.half ? '' : 'sm:col-span-2'}>
      <label className="label" htmlFor={`co-${key}`}>
        {label}
      </label>
      <input id={`co-${key}`} type={opts.type ?? 'text'} required className="field" value={addr[key]} onChange={(e) => setAddr((a) => ({ ...a, [key]: e.target.value }))} />
    </div>
  )

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold tracking-tight">Secure checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="max-w-2xl">
          <Stepper step={step} />

          {step === 3 && order ? (
            <div className="mt-10 rounded-2xl border border-line p-8 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
                <Check size={28} />
              </span>
              <h2 className="mt-4 text-2xl font-bold">Order confirmed</h2>
              <p className="mt-2 text-sm text-muted">
                Order <strong className="text-ink">{order.id}</strong>. Your payment of {formatPrice(order.total)} is held securely until the bike arrives and you've
                completed your 7-day inspection.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Link to="/account" className="btn btn-primary">
                  View in my account
                </Link>
                <Link to="/buy" className="btn btn-outline">
                  Keep browsing
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={next} className="mt-10">
              {step === 0 && (
                <>
                  <h2 className="font-semibold">Delivery address</h2>
                  <div className="mt-4 grid grid-cols-3 rounded-lg border border-line p-1" role="radiogroup" aria-label="Region">
                    {(Object.keys(REGIONS) as Region[]).map((r) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={region === r}
                        key={r}
                        onClick={() => setRegion(r)}
                        className={`rounded-md py-2 text-sm font-medium transition ${region === r ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {field('name', 'Full name')}
                    {field('email', 'Email', { type: 'email' })}
                    {field('line1', 'Address')}
                    {field('city', 'City', { half: true })}
                    {field('postcode', region === 'UK' ? 'Postcode' : 'Postal code', { half: true })}
                  </div>
                  <label className="mt-6 flex items-start gap-3 rounded-lg border border-line p-4">
                    <input type="checkbox" checked={inspection} onChange={(e) => setInspection(e.target.checked)} className="mt-1 accent-ink" />
                    <span>
                      <span className="block text-sm font-semibold">Add professional inspection — £79</span>
                      <span className="text-xs text-muted">A Revelo-partner mechanic checks the bike before it ships, with a full report.</span>
                    </span>
                  </label>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="flex items-center gap-2 font-semibold">
                    <CreditCard size={18} /> Card details
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="cc">Card number</label>
                      <input
                        id="cc"
                        required
                        inputMode="numeric"
                        autoComplete="cc-number"
                        pattern="[0-9 ]{15,23}"
                        placeholder="4242 4242 4242 4242"
                        className="field"
                        value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/[^\d]/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim() }))}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="exp">Expiry</label>
                      <input id="exp" required placeholder="MM/YY" pattern="\d{2}/\d{2}" className="field" value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value.replace(/[^\d]/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2') }))} />
                    </div>
                    <div>
                      <label className="label" htmlFor="cvc">CVC</label>
                      <input id="cvc" required placeholder="123" pattern="\d{3,4}" className="field" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/[^\d]/g, '').slice(0, 4) }))} />
                    </div>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                    <Lock size={13} /> Demo checkout — no card is charged and details are never stored.
                  </p>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4 text-sm">
                  <h2 className="font-semibold">Review your order</h2>
                  <div className="rounded-lg border border-line p-4">
                    <p className="text-xs text-muted">Deliver to</p>
                    <p className="mt-1 font-medium">{addr.name}</p>
                    <p className="text-muted">
                      {addr.line1}, {addr.city} {addr.postcode} · {region}
                    </p>
                  </div>
                  <div className="rounded-lg border border-line p-4">
                    <p className="text-xs text-muted">Payment</p>
                    <p className="mt-1 font-medium">Card ending {card.number.replace(/\s/g, '').slice(-4) || '••••'}</p>
                  </div>
                  <p className="flex items-start gap-2 text-xs text-muted">
                    <ShieldCheck size={15} className="shrink-0 text-brand" /> Funds are held by Revelo until the bike is received and checked.
                  </p>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">
                    Back
                  </button>
                )}
                <button className="btn btn-primary flex-1">
                  {step === 0 ? 'Continue to payment' : step === 1 ? 'Review order' : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-line p-5 lg:sticky lg:top-24">
          <div className="flex gap-4">
            <div className="w-28 shrink-0 overflow-hidden rounded-lg">
              <ListingArt listing={listing} className="aspect-[4/3] w-full" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {listing.brand} {listing.model}
              </p>
              <p className="mt-1 text-xs text-muted">
                {listing.year} · {listing.size} · {listing.seller.name}
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            {[
              ['Bike', listing.price],
              [`Shipping (${region})`, shipping],
              ['Buyer protection', protection],
              ...(inspection ? [['Professional inspection', inspectionFee] as const] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-muted">{k}</dt>
                <dd>{formatPrice(v as number)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
