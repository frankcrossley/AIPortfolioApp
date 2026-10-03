import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ListingDetail from './pages/ListingDetail'
import Valuation from './pages/Valuation'
import Sell from './pages/Sell'
import HowItWorks from './pages/HowItWorks'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import About from './pages/About'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const dark = pathname === '/' || pathname === '/value'
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header overlay={dark} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Browse />} />
          <Route path="/buy/:category" element={<Browse />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/value" element={<Valuation />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
