import { ArrowUpRight, Github, Mail } from 'lucide-react'

const links = [
  { label: 'GitHub', href: 'https://github.com/liuminxin45', icon: Github },
  { label: '邮件', href: 'mailto:384829308@qq.com', icon: Mail },
]

export default function FooterSection() {
  return (
    <footer id="contact" className="footer-section">
      <div className="section-shell">
        <div className="footer-card">
          <p className="soft-label">联系</p>
          <h2>如果你想继续了解我，可以从这些地方找到我。</h2>
          <div className="footer-links">
            {links.map(link => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <link.icon size={18} />
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 刘民心</span>
          <span>React + Tailwind 构建，部署在 Vercel。</span>
        </div>
      </div>
    </footer>
  )
}
