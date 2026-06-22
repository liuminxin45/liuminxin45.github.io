import { Link } from 'react-router'

const siteLinks = [
  { label: '首页', to: '/' },
  { label: '关于我', to: '/about' },
  { label: '摄影', to: '/photography' },
  { label: '博客', to: '/blogs' },
]

const contactLinks = [
  { label: '邮件', href: 'mailto:384829308@qq.com' },
  { label: 'GitHub', href: 'https://github.com/liuminxin45' },
]

export default function FooterSection() {
  return (
    <footer id="contact" className="footer-section">
      <div className="site-container">
        <div className="footer-bar">
          <Link className="footer-brand" to="/" viewTransition>
            刘民心
          </Link>

          <nav className="footer-links" aria-label="页脚导航">
            {siteLinks.map(link => (
              <Link key={link.label} to={link.to} viewTransition>{link.label}</Link>
            ))}
            {contactLinks.map(link => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>

          <span className="footer-bottom">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
