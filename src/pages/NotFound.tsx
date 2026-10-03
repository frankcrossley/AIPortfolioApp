import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x grid place-items-center py-32 text-center">
      <p className="text-sm font-semibold text-muted">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">This one's already been ridden away.</h1>
      <p className="mt-2 text-muted">The page or listing you're looking for doesn't exist or has been sold.</p>
      <Link to="/buy" className="btn btn-primary mt-6">
        Browse bikes
      </Link>
    </div>
  )
}
