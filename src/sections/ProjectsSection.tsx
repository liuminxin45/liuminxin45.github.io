import { ArrowUpRight, BriefcaseBusiness, Camera, NotebookPen, Wrench } from 'lucide-react'

const builds = [
  {
    icon: BriefcaseBusiness,
    title: '工作相关',
    cn: '一个很薄的工作页',
    text: '如果你确实想了解我做过的 SDK、客户端和自动化测试，可以点进去看简版。',
    meta: ['主动查看', '不放首页', '简版'],
    href: '/work',
  },
  {
    icon: NotebookPen,
    title: '文字',
    cn: '想写下来的笔记',
    text: '技术、工具、一些踩坑，还有不一定有用但我想留住的观察。',
    meta: ['待补充', '笔记', '归档'],
  },
  {
    icon: Camera,
    title: '相册',
    cn: '一些生活片刻',
    text: '照片还没整理好，先留一个入口。希望以后不是只有工作内容。',
    meta: ['照片待补', '深圳', '生活'],
  },
  {
    icon: Wrench,
    title: '工具箱',
    cn: '常用工具与配置',
    text: '开发工具、效率软件、桌面环境和一些长期用下来的设置。',
    meta: ['待补充', '工具', '配置'],
  },
]

export default function ProjectsSection() {
  return (
    <section id="builds" className="section-block">
      <div className="section-shell">
        <div className="section-heading compact">
          <p className="soft-label">入口</p>
          <h2>先放几个入口，内容慢慢长出来。</h2>
        </div>

        <div className="build-grid">
          {builds.map(item => {
            const content = (
              <>
                <div className="build-icon">
                  <item.icon size={24} />
                </div>
                <p className="build-title">{item.title}</p>
                <h3>
                  {item.cn}
                  {item.href ? <ArrowUpRight size={18} /> : null}
                </h3>
                <p>{item.text}</p>
                <div className="mini-tags">
                  {item.meta.map(meta => (
                    <span key={meta}>{meta}</span>
                  ))}
                </div>
              </>
            )

            return item.href ? (
              <a className="build-card linked-card" key={item.title} href={item.href}>
                {content}
              </a>
            ) : (
              <article className="build-card" key={item.title}>
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
