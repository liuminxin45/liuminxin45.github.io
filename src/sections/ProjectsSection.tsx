import { photos } from '@/data/photos.generated'

const entries = [
  {
    title: '工作相关',
    text: '保留一页很薄的背景信息，给确实想了解项目经验、技术栈或合作方式的人。',
    href: '/work',
    status: '可查看',
  },
  {
    title: '文字',
    text: '以后会放一些笔记、问题整理和不一定成体系的观察。',
    status: '待补',
  },
  {
    title: '摄影',
    text: '一些生活片段。希望这个地方以后不只有工作和技术。',
    href: '#photography',
    status: '待补',
  },
  {
    title: '工具箱',
    text: '常用工具、开发环境和一些长期保留下来的配置。',
    status: '待补',
  },
]

const visibleEntries = entries.filter(item => item.title !== '摄影' || photos.length > 0)

export default function ProjectsSection() {
  return (
    <section id="builds" className="section-block">
      <div className="section-shell">
        <div className="section-heading">
          <p className="soft-label">入口</p>
          <h2>几个暂时的入口。</h2>
        </div>

        <div className="entry-list">
          {visibleEntries.map(item => {
            const content = (
              <>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <span>{item.status}</span>
              </>
            )

            return item.href ? (
              <a className="entry-row" key={item.title} href={item.href}>
                {content}
              </a>
            ) : (
              <article className="entry-row" key={item.title}>
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
