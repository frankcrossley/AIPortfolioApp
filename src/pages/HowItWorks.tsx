import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BadgeCheck, Camera, CreditCard, Package, ScanSearch, ShieldCheck, Truck, UserCheck } from 'lucide-react'
import BikeArt from '../components/BikeArt'

const VERIFY = [
  { title: 'Seller verification', body: 'Identity and contact details checked against official ID.', icon: UserCheck },
  { title: 'Bike verification', body: 'Serial number, specification and ownership confirmed, and checked against stolen-bike registers.', icon: ScanSearch },
  { title: 'Condition assessment', body: 'Detailed photos reviewed by our team, or an optional in-person inspection by a partner mechanic.', icon: Camera },
  { title: 'Secure transaction', body: 'Funds held until the bike is received and checked by the buyer.', icon: CreditCard },
]

const BUY = [
  { icon: BadgeCheck, title: 'Find a verified bike', body: 'Filter by size, groupset and condition. Every Verified badge means ID and ownership have been checked.' },
  { icon: ShieldCheck, title: 'Pay securely', body: 'Buy now or make an offer. Your money is held by Revelo — never sent directly to the seller.' },
  { icon: Truck, title: 'Insured delivery', body: 'Shipped in bike-specific packaging with a tracked, insured courier across the UK & Europe.' },
  { icon: Package, title: '7-day inspection', body: "Ride it, check it. If it's not as described, send it back for a full refund." },
]

export default function HowItWorks() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <section className="container-x py-12 md:py-16">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted">HOW IT WORKS</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">Buying a used bike, without the gamble.</h1>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BUY.map((s, i) => (
            <div key={s.title}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-white">
                  <s.icon size={18} />
                </span>
                <span className="text-xs font-semibold text-muted">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="verification" className="scroll-mt-24 bg-canvas py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Verified. So you can buy with confidence.</h2>
            <p className="mt-3 max-w-lg text-muted">
              Our verification process checks the bike, seller and documentation to ensure what you see is what you get.
            </p>
            <ol className="mt-8 space-y-6">
              {VERIFY.map((v, i) => (
                <li key={v.title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-sm text-muted">{v.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="overflow-hidden rounded-2xl">
              <BikeArt category="road" frameColor="#16181c" accentColor="#9aa4b1" backdrop="night" brand="Inspected" view={1} className="aspect-[4/3] w-full" />
            </div>
            <div className="mt-4 rounded-xl border border-line bg-white p-5">
              <p className="font-semibold">Professional inspection — £79</p>
              <p className="mt-1 text-sm text-muted">
                A 50-point check by a partner mechanic before the bike ships: frame, drivetrain wear, wheel true, bearings and brakes, with a written report.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Ready to ride?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/buy" className="btn btn-primary">Browse bikes</Link>
          <Link to="/value" className="btn btn-outline">Value my bike</Link>
        </div>
      </section>
    </>
  )
}
