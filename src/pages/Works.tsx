const works = [
  {
    title: 'Auto-Podcast Studio',
    slug: 'auto-podcast',
    type: '桌面端工作台',
    description: '本地运行的 AI 播客工作台，把素材发现、脚本写作、录制或生成音频和发布串成可恢复流程。',
    href: 'https://github.com/liuminxin45/auto-podcast',
  },
]

export default function WorksPage() {
  return (
    <main className="works-page">
      <div className="section-shell">
        <section className="page-hero works-hero">
          <h1>造物间</h1>
          <p>一些我做出来，或者暂时放在这里的小东西。</p>
        </section>

        <section className="work-index" aria-label="造物列表">
          {works.map(work => (
            <a className="work-index-row" key={work.slug} href={work.href} target="_blank" rel="noreferrer">
              <div>
                <p className="soft-label">{work.type}</p>
                <h2>{work.title}</h2>
                <p>{work.description}</p>
              </div>
            </a>
          ))}
        </section>
      </div>
    </main>
  )
}
