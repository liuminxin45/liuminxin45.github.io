import { Link } from 'react-router'
import EmptyState from '@/components/EmptyState'
import { records } from '@/data/records.generated'

export default function TimelineSection() {
  const previewRecords = records.slice(0, 5)

  return (
    <section id="blog-preview" className="section-block">
      <div className="site-container">
        <div className="section-heading with-link">
          <div>
            <h2>博客</h2>
            <span>{records.length} 篇</span>
          </div>
          {previewRecords.length > 0 ? <Link to="/blogs" viewTransition>全部博客 →</Link> : null}
        </div>

        {previewRecords.length > 0 ? (
          <div className="thought-list">
            {previewRecords.map(record => (
              <Link className="thought-row" key={record.slug} to={`/blogs/${record.slug}`} viewTransition>
                <div>
                  <h3>{record.title}</h3>
                  {record.excerpt ? <p>{record.excerpt}</p> : null}
                </div>
                {record.date ? <time>{record.date}</time> : null}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}
