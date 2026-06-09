const nowItems = [
  {
    title: '整理文字',
    text: '先把一些反复想起的问题写下来。可能是技术，也可能是工具、阅读和日常观察。',
  },
  {
    title: '补充照片',
    text: '工作台、城市、路上看到的东西。现在先留空，等素材整理好再慢慢补。',
  },
  {
    title: '调整这个小站',
    text: '先让页面变得舒服、清楚，再决定哪些内容值得留下。不急着一次讲完。',
  },
]

export default function AboutSection() {
  return (
    <section id="now" className="section-block">
      <div className="section-shell">
        <div className="section-heading">
          <p className="soft-label">近况</p>
          <h2>最近在整理这个地方。</h2>
        </div>

        <div className="simple-list">
          {nowItems.map(item => (
            <article className="text-row" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="quiet-note">
          <span>想补充的内容</span>
          <p>头像、工作台照片、文章归档、常用工具、读书/游戏/城市记录。现在先留白，不用假装已经很完整。</p>
        </div>
      </div>
    </section>
  )
}
