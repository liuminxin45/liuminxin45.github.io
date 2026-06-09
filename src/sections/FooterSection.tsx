const links = [
  { label: 'GitHub', href: 'https://github.com/liuminxin45' },
  { label: '邮件', href: 'mailto:384829308@qq.com' },
]

export default function FooterSection() {
  return (
    <footer id="contact" className="footer-section">
      <div className="section-shell">
        <p className="soft-label">联系</p>
        <h2>如果你想继续了解我，可以从这些地方找到我。</h2>
        <div className="plain-links">
          {links.map(link => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 刘民心</span>
          <span>React + Tailwind，部署在 GitHub Pages。</span>
        </div>
      </div>
    </footer>
  )
}
