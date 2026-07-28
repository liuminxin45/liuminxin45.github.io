import { Link } from 'react-router'

const siteLinks = [
  { label: '首页', to: '/' },
  { label: '关于我', to: '/about' },
  { label: '造物', to: '/works' },
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
        <div className="footer-bar" data-reveal>
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

          <div className="footer-registration" aria-label="网站备案信息">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
              蜀ICP备2026018489号-2
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=51030402000225"
              target="_blank"
              rel="noreferrer"
            >
              川公网安备51030402000225号
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
