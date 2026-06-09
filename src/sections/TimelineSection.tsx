const notes = [
  {
    title: '接口边界这件事',
    status: '待写',
    text: '想写写一些系统边界、调用体验和维护成本相关的观察。',
  },
  {
    title: '桌面软件里的小问题',
    status: '待写',
    text: '那些看起来不大、但会慢慢影响体验和稳定性的细节。',
  },
  {
    title: '把工具做顺手',
    status: '待写',
    text: '一些关于自动化、调试、桌面环境和日常工具的整理。',
  },
]

const moments = [
  { title: '工作台', text: '照片待补充' },
  { title: '深圳', text: '城市片段待补充' },
  { title: '书影音', text: '记录待补充' },
]

export default function TimelineSection() {
  return (
    <section id="notes" className="section-block notes-section">
      <div className="section-shell two-column">
        <div>
          <div className="section-heading compact">
            <p className="soft-label">记录</p>
            <h2>一些可能会写的东西。</h2>
          </div>
          <div className="note-list">
            {notes.map(note => (
              <article className="note-card" key={note.title}>
                <span>{note.status}</span>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading compact">
            <p className="soft-label">片刻</p>
            <h2>也留一点空给生活。</h2>
          </div>
          <div className="moment-grid">
            {moments.map(moment => (
              <article className="moment-card" key={moment.title}>
                <div />
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
