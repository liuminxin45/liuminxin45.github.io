import { Github, Mail } from 'lucide-react'
import EmptyState from '@/components/EmptyState'

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:384829308@qq.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/liuminxin45',
    icon: Github,
  },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="section-shell">
        <section className="page-hero about-hero">
          <h1>刘民心</h1>
        </section>

        <section className="contact-strip" aria-label="联系">
          {contactLinks.map(({ href, icon: Icon, label }) => (
            <a key={href} className="contact-pill" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </section>

        <section className="about-empty" aria-label="更多内容">
          <EmptyState rows={3} />
        </section>
      </div>
    </main>
  )
}
