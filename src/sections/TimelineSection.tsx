const notes = [
  {
    title: '接口边界这件事',
    text: '想写写一些系统边界、调用体验和维护成本相关的观察。',
  },
  {
    title: '桌面软件里的小问题',
    text: '那些看起来不大、但会慢慢影响体验和稳定性的细节。',
  },
  {
    title: '把工具做顺手',
    text: '一些关于自动化、调试、桌面环境和日常工具的整理。',
  },
]

const moments = [
  '工作台照片',
  '深圳的城市片段',
  '书影音记录',
]

export default function TimelineSection() {
  return (
    <section id="notes" className="section-block">
      <div className="section-shell split-section">
        <div>
          <div className="section-heading">
            <p className="soft-label">记录</p>
            <h2>一些可能会写的东西。</h2>
          </div>

          <div className="simple-list">
            {notes.map(note => (
              <article className="text-row" key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="side-note" aria-label="生活片刻">
          <p className="soft-label">片刻</p>
          <h2>也留一点空给生活。</h2>
          <ul>
            {moments.map(moment => (
              <li key={moment}>{moment}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
