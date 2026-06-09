import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Github, Mail } from 'lucide-react'

const navItems = [
  { id: 'home', label: '你好' },
  { id: 'now', label: '近况' },
  { id: 'builds', label: '入口' },
  { id: 'notes', label: '记录' },
  { id: 'contact', label: '联系' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (!isHome) {
        setActiveSection('')
        return
      }

      const triggerLine = window.scrollY + window.innerHeight * 0.3

      for (let index = navItems.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(navItems[index].id)
        if (section && section.offsetTop <= triggerLine) {
          setActiveSection(section.id)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const toSection = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="section-shell nav-inner">
          <Link to="/" className="brand-link" aria-label="回到首页">
            <span>刘民心</span>
          </Link>

          <div className="desktop-links">
            {navItems.map(item => (
              <a key={item.id} href={toSection(item.id)} className={activeSection === item.id ? 'active' : ''}>
                {item.label}
              </a>
            ))}
            <Link to="/work" className={location.pathname === '/work' ? 'active' : ''}>
              工作页
            </Link>
          </div>

          <div className="nav-icons">
            <a href="https://github.com/liuminxin45" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href="mailto:384829308@qq.com" aria-label="发送邮件">
              <Mail size={17} />
            </a>
          </div>
        </div>
      </nav>

      <div className="mobile-dock">
        {navItems.slice(0, 4).map(item => (
          <a key={item.id} href={toSection(item.id)} className={activeSection === item.id ? 'active' : ''}>
            {item.label}
          </a>
        ))}
      </div>
    </>
  )
}
