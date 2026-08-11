import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

const works = [
  {
    title: 'PodFlow Studio',
    slug: 'podflow-studio',
    type: '桌面端工作台',
    description: '本地运行的 AI 播客工作台，把素材发现、脚本写作、录制或生成音频和发布串成可恢复流程。',
    href: '/works/podflow-studio',
    capabilities: ['本地优先', 'AI 工作流', '内容生产'],
  },
]

export default function WorksPage() {
  return (
    <main className="works-page">
      <div className="section-shell">
        <section className="page-hero works-hero" data-reveal>
          <h1>造物间</h1>
          <p>一些我做出来，或者暂时放在这里的小东西。</p>
        </section>

        <section className="work-index" aria-label="造物列表" data-reveal="group" data-reveal-delay="1">
          {works.map((work, index) => (
            <Link className="work-index-row" key={work.slug} to={work.href} viewTransition>
              <span className="work-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="work-copy">
                <p className="soft-label">{work.type}</p>
                <h2>{work.title}</h2>
                <p>{work.description}</p>
              </div>
              <ul className="work-capabilities" aria-label="项目特点">
                {work.capabilities.map(capability => <li key={capability}>{capability}</li>)}
              </ul>
              <span className="work-cta">
                查看产品
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
