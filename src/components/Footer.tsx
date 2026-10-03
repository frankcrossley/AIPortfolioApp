import { Link } from 'react-router-dom'

const cols = [
  { title: 'Buy', links: [['Road bikes', '/buy/road'], ['Gravel bikes', '/buy/gravel'], ['Mountain bikes', '/buy/mountain'], ['TT / Triathlon', '/buy/tt'], ['Components', '/buy/components']] },
  { title: 'Sell', links: [['List a bike', '/sell'], ['Free valuation', '/value'], ['Seller dashboard', '/account']] },
  { title: 'Revelo', links: [['How it works', '/how-it-works'], ['Verification', '/how-it-works#verification'], ['About us', '/about']] },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-canvas">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="text-2xl font-extrabold tracking-tight">Revelo</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            The premium marketplace for used bikes. Verified listings, real valuations and secure transactions across the UK &amp; Europe.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold">{c.title}</p>
            <ul className="mt-3 space-y-2">
              {c.links.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Revelo. A demo marketplace — no real transactions take place.</p>
          <p>Prices in GBP · UK &amp; Europe shipping</p>
        </div>
      </div>
    </footer>
  )
}
