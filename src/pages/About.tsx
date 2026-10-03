import { Link } from 'react-router-dom'
import BikeArt from '../components/BikeArt'

export default function About() {
  return (
    <div className="container-x py-12 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted">ABOUT REVELO</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Great bikes deserve a second ride.</h1>
          <p className="mt-5 text-muted">
            Revelo was started by riders who were tired of gambling on classifieds. Buying a £5,000 bike from a stranger shouldn't feel risky, and selling one
            shouldn't mean weeks of time-wasters. So we built a marketplace around trust: verified sellers, checked bikes, honest valuations and payments held
            until you're happy.
          </p>
          <p className="mt-4 text-muted">
            Every bike resold is one less built new — keeping premium machines on the road for longer is the most sustainable thing our sport can do.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/buy" className="btn btn-primary">Shop bikes</Link>
            <Link to="/sell" className="btn btn-outline">Sell yours</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <BikeArt category="gravel" frameColor="#9a7b56" accentColor="#1f1f1f" backdrop="concrete" brand="Revelo" className="aspect-[4/3] w-full" />
        </div>
      </div>
    </div>
  )
}
