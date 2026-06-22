import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { records } from '@/data/records.generated'
import EmptyState from '@/components/EmptyState'

export default function RecordsPage() {
  const years = useMemo(() => Array.from(new Set(records.map(record => record.date.slice(0, 4)).filter(Boolean))), [])
  const categories = useMemo(() => Array.from(new Set(records.map(record => record.category).filter(Boolean))), [])
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const showFilters = years.length > 1 || categories.length > 1

  const visibleRecords = records.filter(record => {
    const matchYear = selectedYear === 'all' || record.date.startsWith(selectedYear)
    const matchCategory = selectedCategory === 'all' || record.category === selectedCategory

    return matchYear && matchCategory
  })

  return (
    <main className="records-page">
      <div className="section-shell">
        <section className="page-hero">
          <h1>博客</h1>
        </section>

        {records.length > 0 ? (
          <section className="record-index">
            {showFilters ? (
              <div className="blog-filters" aria-label="筛选博客">
                <label>
                  <span>年份</span>
                  <select value={selectedYear} onChange={event => setSelectedYear(event.target.value)}>
                    <option value="all">全部</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>分类</span>
                  <select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}>
                    <option value="all">全部</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {visibleRecords.length > 0 ? visibleRecords.map(record => (
              <Link className="record-index-row" key={record.slug} to={`/blogs/${record.slug}`} viewTransition>
                <div>
                  <p className="soft-label">{record.category}</p>
                  <h2>{record.title}</h2>
                  {record.excerpt ? <p>{record.excerpt}</p> : null}
                </div>
                <span>{record.date}</span>
              </Link>
            )) : <EmptyState />}
          </section>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  )
}
