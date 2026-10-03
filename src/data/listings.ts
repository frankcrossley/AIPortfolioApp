export type Category = 'road' | 'gravel' | 'mountain' | 'tt' | 'components'
export type Condition = 'Excellent' | 'Great' | 'Good'

export interface Seller {
  name: string
  initials: string
  rating: number
  reviews: number
  type: 'Private seller' | 'Trade seller'
  memberSince: number
}

export interface Listing {
  id: string
  brand: string
  model: string
  category: Category
  year: number
  size: string
  groupset: string
  wheels: string
  price: number
  originalPrice: number
  condition: Condition
  location: string
  verified: boolean
  mileageKm: number
  frameColor: string
  accentColor: string
  backdrop: 'wall' | 'studio' | 'night' | 'concrete'
  photos: number
  postedDaysAgo: number
  views: number
  seller: Seller
  description: string
  specs: Record<string, string>
}

export const CATEGORIES: { id: Category; label: string; plural: string }[] = [
  { id: 'road', label: 'Road', plural: 'Road Bikes' },
  { id: 'gravel', label: 'Gravel', plural: 'Gravel Bikes' },
  { id: 'mountain', label: 'Mountain', plural: 'Mountain Bikes' },
  { id: 'tt', label: 'TT / Triathlon', plural: 'TT & Triathlon Bikes' },
  { id: 'components', label: 'Components', plural: 'Components' },
]

/** Marketplace-wide counts shown on the homepage tiles (the demo data is a sample). */
export const CATEGORY_TOTALS: Record<Category, { count: number; unit: string }> = {
  road: { count: 1240, unit: 'bikes' },
  gravel: { count: 532, unit: 'bikes' },
  mountain: { count: 418, unit: 'bikes' },
  tt: { count: 176, unit: 'bikes' },
  components: { count: 2340, unit: 'items' },
}

const sellers: Seller[] = [
  { name: 'James S.', initials: 'JS', rating: 5.0, reviews: 12, type: 'Private seller', memberSince: 2021 },
  { name: 'Olivia R.', initials: 'OR', rating: 4.9, reviews: 31, type: 'Private seller', memberSince: 2019 },
  { name: 'Cadence Cycles', initials: 'CC', rating: 4.8, reviews: 214, type: 'Trade seller', memberSince: 2018 },
  { name: 'Tom R.', initials: 'TR', rating: 5.0, reviews: 7, type: 'Private seller', memberSince: 2022 },
  { name: 'Priya K.', initials: 'PK', rating: 4.7, reviews: 19, type: 'Private seller', memberSince: 2020 },
  { name: 'Velo Exchange', initials: 'VE', rating: 4.9, reviews: 388, type: 'Trade seller', memberSince: 2017 },
  { name: 'Marcus L.', initials: 'ML', rating: 4.6, reviews: 4, type: 'Private seller', memberSince: 2023 },
]

type Seed = Omit<Listing, 'id' | 'seller' | 'specs' | 'description' | 'originalPrice'> & {
  seller: number
  description?: string
  originalPrice?: number
}

const seeds: Seed[] = [
  { brand: 'Specialized', model: 'S-Works Tarmac SL8', category: 'road', year: 2024, size: '54cm', groupset: 'Shimano Dura-Ace Di2', wheels: 'Roval Rapide CLX', price: 5250, originalPrice: 12000, condition: 'Excellent', location: 'London, UK', verified: true, mileageKm: 2000, frameColor: '#1c2128', accentColor: '#5aa9e6', backdrop: 'wall', photos: 21, postedDaysAgo: 3, views: 412, seller: 0,
    description: 'An exceptional S-Works Tarmac SL8 in excellent condition. Bought new in March 2024 and used for one season. No crashes, regularly serviced. Selling due to upgrade. Includes original invoice, two sets of tyres and Garmin mount.' },
  { brand: 'Cervélo', model: 'S5', category: 'road', year: 2023, size: '56cm', groupset: 'SRAM Red AXS', wheels: 'Zipp 454', price: 5900, condition: 'Great', location: 'Bath, UK', verified: true, mileageKm: 4800, frameColor: '#e9e6df', accentColor: '#c62828', backdrop: 'concrete', photos: 14, postedDaysAgo: 6, views: 288, seller: 1 },
  { brand: 'Pinarello', model: 'Dogma F', category: 'road', year: 2023, size: '54cm', groupset: 'Shimano Dura-Ace Di2', wheels: 'Princeton Grit', price: 7200, condition: 'Excellent', location: 'Manchester, UK', verified: true, mileageKm: 3100, frameColor: '#f2f2f2', accentColor: '#1d1d1d', backdrop: 'night', photos: 18, postedDaysAgo: 1, views: 530, seller: 2 },
  { brand: 'Trek', model: 'Madone SLR', category: 'road', year: 2024, size: '56cm', groupset: 'Shimano Dura-Ace Di2', wheels: 'Aeolus RSL', price: 5100, condition: 'Good', location: 'Brighton, UK', verified: false, mileageKm: 6200, frameColor: '#23272e', accentColor: '#9aa4b1', backdrop: 'wall', photos: 12, postedDaysAgo: 9, views: 142, seller: 3 },
  { brand: 'Cervélo', model: 'R5', category: 'road', year: 2022, size: '54cm', groupset: 'Shimano Ultegra Di2', wheels: 'Reserve 34|37', price: 4800, condition: 'Great', location: 'Leeds, UK', verified: true, mileageKm: 7400, frameColor: '#2d3a4a', accentColor: '#e0b03c', backdrop: 'studio', photos: 16, postedDaysAgo: 4, views: 201, seller: 4 },
  { brand: 'Giant', model: 'TCR Advanced SL 0', category: 'road', year: 2023, size: 'M', groupset: 'SRAM Red AXS', wheels: 'Cadex 36', price: 4350, condition: 'Excellent', location: 'Edinburgh, UK', verified: true, mileageKm: 2600, frameColor: '#0f2a44', accentColor: '#7fd1ff', backdrop: 'concrete', photos: 15, postedDaysAgo: 12, views: 176, seller: 5 },
  { brand: 'Specialized', model: 'S-Works Tarmac SL7', category: 'road', year: 2022, size: '56cm', groupset: 'Shimano Dura-Ace Di2', wheels: 'Roval Rapide CLX', price: 3950, condition: 'Great', location: 'Bristol, UK', verified: true, mileageKm: 9100, frameColor: '#3b1f2b', accentColor: '#d6a5b5', backdrop: 'night', photos: 13, postedDaysAgo: 15, views: 344, seller: 6 },
  { brand: 'Canyon', model: 'Aeroad CFR', category: 'road', year: 2023, size: 'M', groupset: 'Shimano Dura-Ace Di2', wheels: 'DT Swiss ARC 1100', price: 5400, condition: 'Excellent', location: 'Amsterdam, NL', verified: true, mileageKm: 3300, frameColor: '#16181c', accentColor: '#f05a28', backdrop: 'studio', photos: 17, postedDaysAgo: 2, views: 265, seller: 5 },
  { brand: 'Factor', model: 'Ostro VAM', category: 'road', year: 2023, size: '54cm', groupset: 'SRAM Red AXS', wheels: 'Black Inc 45', price: 5650, condition: 'Great', location: 'Girona, ES', verified: false, mileageKm: 5100, frameColor: '#4a5a3a', accentColor: '#e8e0c8', backdrop: 'wall', photos: 11, postedDaysAgo: 20, views: 98, seller: 1 },
  { brand: 'Trek', model: 'Émonda SLR 9', category: 'road', year: 2022, size: '52cm', groupset: 'SRAM Red eTap AXS', wheels: 'Aeolus RSL 37', price: 4200, condition: 'Good', location: 'Cardiff, UK', verified: true, mileageKm: 11200, frameColor: '#5b6b7a', accentColor: '#ffffff', backdrop: 'concrete', photos: 10, postedDaysAgo: 8, views: 156, seller: 3 },
  { brand: 'Pinarello', model: 'Dogma F12', category: 'road', year: 2021, size: '56cm', groupset: 'Campagnolo Super Record EPS', wheels: 'Fulcrum Speed 40', price: 4600, condition: 'Great', location: 'Milan, IT', verified: true, mileageKm: 12800, frameColor: '#101820', accentColor: '#c9a227', backdrop: 'night', photos: 14, postedDaysAgo: 5, views: 309, seller: 2 },

  { brand: 'Specialized', model: 'S-Works Crux', category: 'gravel', year: 2023, size: '54cm', groupset: 'SRAM Red XPLR AXS', wheels: 'Roval Terra CLX', price: 6100, condition: 'Excellent', location: 'Sheffield, UK', verified: true, mileageKm: 1800, frameColor: '#5c6e58', accentColor: '#d8cfa8', backdrop: 'concrete', photos: 15, postedDaysAgo: 3, views: 220, seller: 4 },
  { brand: '3T', model: 'Exploro RaceMax', category: 'gravel', year: 2022, size: 'M', groupset: 'Shimano GRX Di2', wheels: 'Discus 45|40', price: 3200, condition: 'Great', location: 'Bristol, UK', verified: true, mileageKm: 6900, frameColor: '#262626', accentColor: '#e6c24a', backdrop: 'wall', photos: 12, postedDaysAgo: 11, views: 133, seller: 6 },
  { brand: 'Canyon', model: 'Grail CF SLX 8', category: 'gravel', year: 2023, size: 'L', groupset: 'SRAM Force XPLR AXS', wheels: 'DT Swiss GRC 1400', price: 3450, condition: 'Excellent', location: 'Utrecht, NL', verified: true, mileageKm: 2400, frameColor: '#9a7b56', accentColor: '#1f1f1f', backdrop: 'studio', photos: 16, postedDaysAgo: 7, views: 187, seller: 5 },
  { brand: 'Cervélo', model: 'Áspero-5', category: 'gravel', year: 2023, size: '54cm', groupset: 'SRAM Red XPLR AXS', wheels: 'Reserve 32|35', price: 4700, condition: 'Great', location: 'Kendal, UK', verified: false, mileageKm: 4100, frameColor: '#30475e', accentColor: '#f2a65a', backdrop: 'night', photos: 9, postedDaysAgo: 14, views: 87, seller: 1 },
  { brand: 'Open', model: 'WI.DE.', category: 'gravel', year: 2022, size: 'M', groupset: 'Shimano GRX 820', wheels: 'Enve G23', price: 3900, condition: 'Good', location: 'Inverness, UK', verified: true, mileageKm: 8800, frameColor: '#c9c3b5', accentColor: '#2a2a2a', backdrop: 'concrete', photos: 11, postedDaysAgo: 19, views: 110, seller: 0 },

  { brand: 'Santa Cruz', model: 'Megatower CC', category: 'mountain', year: 2023, size: 'L', groupset: 'SRAM X0 Eagle Transmission', wheels: 'Reserve 30|HD', price: 5800, condition: 'Great', location: 'Fort William, UK', verified: true, mileageKm: 1500, frameColor: '#2f4f3f', accentColor: '#f0c419', backdrop: 'wall', photos: 19, postedDaysAgo: 2, views: 302, seller: 2 },
  { brand: 'Specialized', model: 'S-Works Epic', category: 'mountain', year: 2022, size: 'M', groupset: 'SRAM XX1 AXS', wheels: 'Roval Control SL', price: 4900, condition: 'Excellent', location: 'Peebles, UK', verified: true, mileageKm: 2200, frameColor: '#7a1f1f', accentColor: '#eeeeee', backdrop: 'studio', photos: 13, postedDaysAgo: 10, views: 168, seller: 4 },
  { brand: 'Yeti', model: 'SB140 T3', category: 'mountain', year: 2023, size: 'L', groupset: 'SRAM X0 Eagle', wheels: 'DT Swiss EXC 1501', price: 5200, condition: 'Great', location: 'Bethesda, UK', verified: false, mileageKm: 1900, frameColor: '#38b2ac', accentColor: '#1a1a1a', backdrop: 'concrete', photos: 12, postedDaysAgo: 6, views: 241, seller: 6 },
  { brand: 'Trek', model: 'Supercaliber SLR 9.9', category: 'mountain', year: 2024, size: 'M', groupset: 'SRAM XX SL Transmission', wheels: 'Bontrager Kovee RSL', price: 6900, condition: 'Excellent', location: 'Dumfries, UK', verified: true, mileageKm: 900, frameColor: '#20262e', accentColor: '#a6e22e', backdrop: 'night', photos: 15, postedDaysAgo: 1, views: 199, seller: 5 },

  { brand: 'Cervélo', model: 'P5', category: 'tt', year: 2022, size: '56cm', groupset: 'SRAM Red eTap AXS', wheels: 'Zipp 858 / Super-9 disc', price: 6400, condition: 'Excellent', location: 'Nottingham, UK', verified: true, mileageKm: 3500, frameColor: '#111111', accentColor: '#e53935', backdrop: 'studio', photos: 17, postedDaysAgo: 4, views: 158, seller: 1 },
  { brand: 'Canyon', model: 'Speedmax CFR', category: 'tt', year: 2023, size: 'M', groupset: 'Shimano Dura-Ace Di2', wheels: 'DT Swiss ARC 1100 80', price: 6800, condition: 'Great', location: 'Koblenz, DE', verified: true, mileageKm: 4200, frameColor: '#e8e8e8', accentColor: '#1565c0', backdrop: 'concrete', photos: 14, postedDaysAgo: 13, views: 121, seller: 5 },
  { brand: 'Specialized', model: 'S-Works Shiv', category: 'tt', year: 2021, size: 'M', groupset: 'SRAM Red eTap AXS', wheels: 'Roval 77 / 321 disc', price: 4250, condition: 'Good', location: 'Bournemouth, UK', verified: false, mileageKm: 9800, frameColor: '#2a2440', accentColor: '#c8b7ff', backdrop: 'night', photos: 10, postedDaysAgo: 22, views: 76, seller: 3 },

  { brand: 'ENVE', model: 'SES 4.5 Wheelset', category: 'components', year: 2023, size: '700c', groupset: 'Shimano HG freehub', wheels: 'ENVE SES 4.5', price: 1500, condition: 'Excellent', location: 'London, UK', verified: true, mileageKm: 1200, frameColor: '#1b1b1b', accentColor: '#cfd8dc', backdrop: 'studio', photos: 8, postedDaysAgo: 2, views: 95, seller: 0 },
  { brand: 'Zipp', model: '404 Firecrest Wheelset', category: 'components', year: 2022, size: '700c', groupset: 'SRAM XDR freehub', wheels: 'Zipp 404 Firecrest', price: 1050, condition: 'Great', location: 'York, UK', verified: true, mileageKm: 4000, frameColor: '#1e1e1e', accentColor: '#ffffff', backdrop: 'concrete', photos: 7, postedDaysAgo: 9, views: 64, seller: 6 },
  { brand: 'Roval', model: 'Rapide CLX II Wheelset', category: 'components', year: 2023, size: '700c', groupset: 'Shimano HG freehub', wheels: 'Roval Rapide CLX II', price: 1650, condition: 'Excellent', location: 'Oxford, UK', verified: false, mileageKm: 800, frameColor: '#181818', accentColor: '#9e9e9e', backdrop: 'wall', photos: 9, postedDaysAgo: 5, views: 71, seller: 4 },
]

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const listings: Listing[] = seeds.map((s, i) => {
  const original = s.originalPrice ?? Math.round((s.price * 2.1) / 100) * 100
  return {
    ...s,
    id: `${slug(`${s.brand} ${s.model}`)}-${i + 1}`,
    seller: sellers[s.seller],
    originalPrice: original,
    description:
      s.description ??
      `${s.year} ${s.brand} ${s.model} in ${s.condition.toLowerCase()} condition. Ridden roughly ${s.mileageKm.toLocaleString('en-GB')} km and serviced regularly by a local workshop. ${s.groupset} drivetrain paired with ${s.wheels}. Comes with original paperwork and spares. Happy to answer any questions.`,
    specs: {
      Brand: s.brand,
      Model: s.model,
      Year: String(s.year),
      'Frame size': s.size,
      Groupset: s.groupset,
      Wheels: s.wheels,
      'Frame material': s.category === 'components' ? 'Carbon' : 'Carbon fibre',
      Brakes: s.category === 'components' ? 'Disc' : 'Hydraulic disc',
      'Approx. mileage': `${s.mileageKm.toLocaleString('en-GB')} km`,
    },
  }
})

export const getListing = (id: string) => listings.find((l) => l.id === id)

export const formatPrice = (n: number) => `£${n.toLocaleString('en-GB')}`
