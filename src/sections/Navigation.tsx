import { Link, NavLink } from 'react-router'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/about', label: '关于我' },
  { to: '/works', label: '造物' },
  { to: '/photography', label: '摄影' },
  { to: '/blogs', label: '博客' },
]

export default function Navigation() {
  return (
    <nav className="site-nav">
      <div className="site-container nav-inner">
        <div className="nav-left">
          <Link to="/" className="brand-link" aria-label="首页">
            刘民心
          </Link>

          <div className="nav-links">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                viewTransition
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  )
}
