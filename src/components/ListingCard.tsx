import { Link } from 'react-router-dom'
import { BadgeCheck, Heart, MapPin, ShieldCheck } from 'lucide-react'
import BikeArt from './BikeArt'
import { formatPrice, type Listing } from '../data/listings'
import { useStore } from '../lib/store'

export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold text-brand ${className}`}>
      <BadgeCheck size={12} strokeWidth={2.5} /> Verified
    </span>
  )
}

export function FavouriteButton({ id, className = '' }: { id: string; className?: string }) {
  const { isFavourite, toggleFavourite } = useStore()
  const fav = isFavourite(id)
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavourite(id)
      }}
      aria-pressed={fav}
      aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
      className={`grid size-8 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-105 ${className}`}
    >
      <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : ''} />
    </button>
  )
}

export function ListingArt({ listing, view = 0, className = '' }: { listing: Listing; view?: number; className?: string }) {
  return (
    <BikeArt
      category={listing.category}
      frameColor={listing.frameColor}
      accentColor={listing.accentColor}
      backdrop={listing.backdrop}
      brand={listing.brand}
      label={`${listing.year} ${listing.brand} ${listing.model}`}
      view={view}
      className={className}
    />
  )
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ListingArt listing={listing} className="size-full transition duration-500 group-hover:scale-[1.03]" />
        {listing.verified && <VerifiedBadge className="absolute left-2.5 top-2.5 shadow-sm" />}
        <FavouriteButton id={listing.id} className="absolute right-2.5 top-2.5" />
      </div>
      <div className="p-3.5">
        <h3 className="truncate text-sm font-semibold">
          {listing.brand} {listing.model}
        </h3>
        <p className="mt-0.5 truncate text-xs text-muted">
          {listing.year} · {listing.size} · {listing.groupset} · {listing.wheels}
        </p>
        <p className="mt-3 text-lg font-bold">{formatPrice(listing.price)}</p>
        <div className="mt-2.5 flex items-center gap-4 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} /> {listing.condition} condition
          </span>
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin size={12} /> {listing.location}
          </span>
        </div>
      </div>
    </Link>
  )
}
