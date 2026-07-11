import { Github, Mail } from 'lucide-react'
import Magnetic from '@/components/Magnetic'

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

const focusItems = [
  {
    index: '01',
    title: '工程实践',
    description: '记录复杂工程里的开发流程、验证闭环与知识治理。',
  },
  {
    index: '02',
    title: '小工具',
    description: '把重复工作整理成可恢复、可验证的本地工作流。',
  },
  {
    index: '03',
    title: '摄影',
    description: '在技术之外，保存生活里值得反复看的瞬间。',
  },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="section-shell">
        <section className="page-hero about-hero" data-reveal>
          <h1>关于我</h1>
        </section>

        <section className="about-intro" data-reveal data-reveal-delay="1">
          <p className="about-lead">
            我是刘民心。这里收拢我正在实践的工程方法、做出来的小工具，以及技术之外的日常影像。
          </p>
          <p>
            我更关心一件事情如何被可靠地完成：问题是否被说清楚，过程能否验证，经验能否在下一次继续发挥作用。
          </p>
        </section>

        <section className="about-focus" aria-label="关注方向" data-reveal="group" data-reveal-delay="1">
          {focusItems.map(item => (
            <article key={item.index}>
              <span>{item.index}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="contact-strip" aria-label="联系" data-reveal data-reveal-delay="2">
          {contactLinks.map(({ href, icon: Icon, label }) => (
            <a key={href} className="contact-pill" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <Magnetic className="magnetic-label" strength={6}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Magnetic>
            </a>
          ))}
        </section>

      </div>
    </main>
  )
}
