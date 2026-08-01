import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Sketchbook', href: '/portfolio' },
  { label: 'Reel', href: 'https://vimeo.com/1148496002?fl=pl&fe=ti', external: true },
]

export default function NavBar({ name = 'Your Name' }) {
  const location = useLocation()

  return (
    <header className="navbar">
      <div className="navbar-name">{name}</div>
      <nav className="navbar-tabs">
        {NAV_LINKS.map(({ label, href, external }) => {
          const isActive = !external && location.pathname === href

          if (external) {
            return (
              <a
                key={label}
                href={href}
                className="navbar-tab"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            )
          }

          return (
            <Link
              key={label}
              to={href}
              className={`navbar-tab${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}