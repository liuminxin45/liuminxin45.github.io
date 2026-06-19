import { Link } from 'react-router'
import { records } from '@/data/records.generated'

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
  const previewRecords = records.slice(0, 3)
  const visibleNotes = previewRecords.length > 0 ? previewRecords : notes

  return (
    <section id="notes" className="section-block">
      <div className="section-shell split-section">
        <div>
          <div className="section-heading with-link">
            <div>
              <p className="soft-label">记录</p>
              <h2>{previewRecords.length > 0 ? '最近写下来的东西。' : '一些可能会写的东西。'}</h2>
            </div>
            {previewRecords.length > 0 ? <Link to="/records">查看更多</Link> : null}
          </div>

          <div className="simple-list">
            {visibleNotes.map(note => (
              'slug' in note ? (
                <Link className="text-row" key={note.slug} to={`/records/${note.slug}`}>
                  <h3>{note.title}</h3>
                  <p>{note.excerpt}</p>
                </Link>
              ) : (
                <article className="text-row" key={note.title}>
                  <h3>{note.title}</h3>
                  <p>{note.text}</p>
                </article>
              )
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
