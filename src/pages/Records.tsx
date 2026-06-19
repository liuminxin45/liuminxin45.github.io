import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { records } from '@/data/records.generated'

export default function RecordsPage() {
  return (
    <main className="records-page">
      <div className="section-shell">
        <Link className="back-link" to="/">
          <ArrowLeft size={17} />
          回到首页
        </Link>

        <section className="work-hero">
          <p className="soft-label">记录</p>
          <h1>技术、工具和工程现场的记录。</h1>
          <p>这里放更完整的文章。首页只保留最近几篇，方便快速扫一眼。</p>
        </section>

        {records.length > 0 ? (
          <section className="record-index">
            {records.map(record => (
              <Link className="record-index-row" key={record.slug} to={`/records/${record.slug}`}>
                <div>
                  <p className="soft-label">{record.category}</p>
                  <h2>{record.title}</h2>
                  {record.excerpt ? <p>{record.excerpt}</p> : null}
                </div>
                <span>{record.date}</span>
              </Link>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}
