import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { listings as seedListings, type Listing } from '../data/listings'

export type MyListingStatus = 'Live' | 'Under review' | 'Draft' | 'Sold'

export interface MyListing {
  listingId: string
  status: MyListingStatus
  note: string
}

export interface Order {
  id: string
  listingId: string
  total: number
  placedAt: string
  name: string
  city: string
}

interface State {
  favourites: string[]
  userListings: Listing[]
  myListings: MyListing[]
  orders: Order[]
}

interface Store extends State {
  allListings: Listing[]
  toggleFavourite: (id: string) => void
  isFavourite: (id: string) => boolean
  addUserListing: (l: Listing) => void
  placeOrder: (o: Omit<Order, 'id' | 'placedAt'>) => Order
}

const KEY = 'revelo:v1'

const findSeed = (brand: string, model: string) =>
  seedListings.find((l) => l.brand === brand && l.model === model)?.id ?? seedListings[0].id

const initialState: State = {
  favourites: [],
  userListings: [],
  myListings: [
    { listingId: findSeed('Trek', 'Madone SLR'), status: 'Live', note: '142 views' },
    { listingId: findSeed('Cervélo', 'R5'), status: 'Under review', note: 'Submitted 2 days ago' },
    { listingId: findSeed('ENVE', 'SES 4.5 Wheelset'), status: 'Draft', note: 'Complete listing' },
    { listingId: findSeed('Specialized', 'S-Works Tarmac SL7'), status: 'Sold', note: 'Finished 12 Aug' },
  ],
  orders: [],
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    return { ...initialState, ...(JSON.parse(raw) as Partial<State>) }
  } catch {
    return initialState
  }
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — keep state in memory */
    }
  }, [state])

  const value = useMemo<Store>(() => {
    const allListings = [...state.userListings, ...seedListings]
    return {
      ...state,
      allListings,
      isFavourite: (id) => state.favourites.includes(id),
      toggleFavourite: (id) =>
        setState((s) => ({
          ...s,
          favourites: s.favourites.includes(id) ? s.favourites.filter((f) => f !== id) : [id, ...s.favourites],
        })),
      addUserListing: (l) =>
        setState((s) => ({
          ...s,
          userListings: [l, ...s.userListings],
          myListings: [{ listingId: l.id, status: 'Under review', note: 'Submitted just now' }, ...s.myListings],
        })),
      placeOrder: (o) => {
        const order: Order = { ...o, id: `RV-${Math.floor(100000 + Math.random() * 900000)}`, placedAt: new Date().toISOString() }
        setState((s) => ({ ...s, orders: [order, ...s.orders] }))
        return order
      },
    }
  }, [state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
