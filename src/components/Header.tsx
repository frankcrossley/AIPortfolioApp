import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, User, X } from 'lucide-react'

const NAV = [
  { to: '/buy', label: 'Buy' },
  { to: '/sell', label: 'Sell' },
  { to: '/value', label: 'Value' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`} aria-label="Revelo home">
      Revelo
    </Link>
  )
}

export default function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    setSearching(false)
  }, [pathname])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/buy?q=${encodeURIComponent(q.trim())}`)
  }

  const light = overlay && !open
  const text = light ? 'text-white/80 hover:text-white' : 'text-ink/70 hover:text-ink'

  return (
    <header className={`${overlay ? 'absolute inset-x-0 top-0' : 'sticky top-0 border-b border-line bg-white/95 backdrop-blur'} z-40`}>
      <div className="container-x flex h-16 items-center gap-8 md:h-20">
        <Logo light={light} />
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition ${text} ${isActive ? (light ? '!text-white' : '!text-ink') + " after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded after:bg-current after:content-['']" : ''}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button onClick={() => setSearching((s) => !s)} className={`rounded-full p-2.5 ${text}`} aria-label="Search">
            <Search size={19} />
          </button>
          <Link to="/account" className={`rounded-full p-2.5 ${text}`} aria-label="My account">
            <User size={19} />
          </Link>
          <Link to="/sell" className={`btn ml-2 hidden !py-2.5 sm:inline-flex ${light ? 'btn-light' : 'btn-primary'}`}>
            List a bike
          </Link>
          <button onClick={() => setOpen((o) => !o)} className={`rounded-full p-2.5 md:hidden ${text}`} aria-label="Menu">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {searching && (
        <div className="container-x pb-4">
          <form onSubmit={submit} className="flex overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bikes, frames, components…"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <button className="btn btn-primary m-1.5 !px-4" aria-label="Submit search">
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className="py-3 text-base font-medium text-ink">
                {n.label}
              </NavLink>
            ))}
            <Link to="/sell" className="btn btn-primary my-3">
              List a bike
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
