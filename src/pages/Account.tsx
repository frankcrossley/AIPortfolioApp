import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListingArt } from '../components/ListingCard'
import ListingCard from '../components/ListingCard'
import { formatPrice } from '../data/listings'
import { useStore, type MyListingStatus } from '../lib/store'

const TABS = ['Buying', 'Selling', 'Favourites', 'Settings'] as const
type Tab = (typeof TABS)[number]

const STATUS: Record<MyListingStatus, string> = {
  Live: 'bg-brand-soft text-brand',
  'Under review': 'bg-amber-100 text-amber-800',
  Draft: 'bg-canvas text-muted ring-1 ring-line',
  Sold: 'bg-brand-soft text-brand',
}

function Empty({ text, cta, to }: { text: string; cta: string; to: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-14 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link to={to} className="btn btn-primary mt-4">
        {cta}
      </Link>
    </div>
  )
}

export default function Account() {
  const [tab, setTab] = useState<Tab>('Selling')
  const [saved, setSaved] = useState(false)
  const { allListings, myListings, favourites, orders } = useStore()
  const byId = (id: string) => allListings.find((l) => l.id === id)

  const live = myListings.filter((m) => m.status === 'Live' || m.status === 'Under review').length
  const sold = myListings.filter((m) => m.status === 'Sold')
  const earned = sold.reduce((sum, m) => sum + (byId(m.listingId)?.price ?? 0), 0)

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-ink text-lg font-bold text-white">FC</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My account</h1>
            <p className="text-sm text-muted">Frank Crossley · Member since 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            ['Active listings', live],
            ['Bikes sold', sold.length],
            ['Earned', formatPrice(earned)],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xl font-bold">{v}</p>
              <p className="text-xs text-muted">{k}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="no-scrollbar mt-8 flex gap-8 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium ${tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {t}
            {t === 'Favourites' && favourites.length > 0 && <span className="ml-1.5 rounded-full bg-canvas px-1.5 text-xs">{favourites.length}</span>}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Selling' && (
          <div className="max-w-3xl">
            <ul className="divide-y divide-line rounded-xl border border-line">
              {myListings.map((m) => {
                const l = byId(m.listingId)
                if (!l) return null
                return (
                  <li key={m.listingId}>
                    <Link to={`/listing/${l.id}`} className="flex items-center gap-4 p-4 transition hover:bg-canvas">
                      <div className="w-24 shrink-0 overflow-hidden rounded-lg">
                        <ListingArt listing={l} className="aspect-[4/3] w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {l.brand} {l.model}
                        </p>
                        <p className="text-sm">{formatPrice(l.price)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS[m.status]}`}>{m.status}</span>
                        <p className="mt-1 text-xs text-muted">{m.note}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Link to="/sell" className="btn btn-primary mt-6 w-full sm:w-auto sm:px-12">
              List another bike
            </Link>
          </div>
        )}

        {tab === 'Buying' &&
          (orders.length ? (
            <ul className="max-w-3xl divide-y divide-line rounded-xl border border-line">
              {orders.map((o) => {
                const l = byId(o.listingId)
                return (
                  <li key={o.id} className="flex items-center gap-4 p-4">
                    {l && (
                      <div className="w-24 shrink-0 overflow-hidden rounded-lg">
                        <ListingArt listing={l} className="aspect-[4/3] w-full" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{l ? `${l.brand} ${l.model}` : 'Listing removed'}</p>
                      <p className="text-xs text-muted">
                        {o.id} · {new Date(o.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">Preparing shipment</span>
                      <p className="mt-1 text-sm font-semibold">{formatPrice(o.total)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Empty text="You haven't bought anything yet." cta="Browse bikes" to="/buy" />
          ))}

        {tab === 'Favourites' &&
          (favourites.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {favourites.map((id) => {
                const l = byId(id)
                return l ? <ListingCard key={id} listing={l} /> : null
              })}
            </div>
          ) : (
            <Empty text="Tap the heart on any listing to save it here." cta="Find a bike" to="/buy" />
          ))}

        {tab === 'Settings' && (
          <form className="grid max-w-xl gap-4 sm:grid-cols-2" onSubmit={(e) => {
              e.preventDefault()
              setSaved(true)
            }}
            onChange={() => setSaved(false)}>
            <div>
              <label className="label" htmlFor="set-name">Name</label>
              <input id="set-name" className="field" defaultValue="Frank Crossley" />
            </div>
            <div>
              <label className="label" htmlFor="set-loc">Location</label>
              <input id="set-loc" className="field" defaultValue="London, UK" />
            </div>
            <div className="sm:col-span-2 space-y-2 pt-2">
              {['Email me when a saved bike drops in price', 'Email me new listings matching my searches', 'Weekly market report'].map((t, i) => (
                <label key={t} className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" defaultChecked={i < 2} className="size-4 accent-ink" /> {t}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button className="btn btn-primary w-fit">Save changes</button>
              {saved && <span className="text-sm text-brand">Saved</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
