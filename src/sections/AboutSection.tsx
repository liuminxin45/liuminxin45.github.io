import { Camera, NotebookPen, Sparkles } from 'lucide-react'

const nowItems = [
  {
    icon: NotebookPen,
    title: '整理一些笔记',
    text: '先从工作里反复遇到的问题开始写，之后也会放一些读书、工具和生活记录。',
  },
  {
    icon: Camera,
    title: '补几张照片',
    text: '工作台、城市、出门路上看到的东西。现在先留空，等素材整理好再放上来。',
  },
  {
    icon: Sparkles,
    title: '慢慢搭这个小站',
    text: '先把页面搭成舒服的样子，再补内容。不急着一次性讲完所有事情。',
  },
]

export default function AboutSection() {
  return (
    <section id="now" className="section-block now-section">
      <div className="section-shell">
        <div className="section-heading compact">
          <p className="soft-label">近况</p>
          <h2>最近想把这个地方慢慢收拾出来。</h2>
        </div>

        <div className="now-grid">
          {nowItems.map(item => (
            <article className="plain-card" key={item.title}>
              <item.icon size={22} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="note-strip">
          <span>想补充的内容</span>
          <p>头像、工作台照片、文章归档、常用工具、读书/游戏/城市记录。现在先留白，不用假装已经很完整。</p>
        </div>
      </div>
    </section>
  )
}
