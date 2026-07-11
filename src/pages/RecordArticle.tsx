import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowUp } from 'lucide-react'
import ImageLightbox from '@/components/ImageLightbox'
import { records } from '@/data/records.generated'

export default function RecordArticlePage() {
  const { slug } = useParams()
  const record = records.find(item => item.slug === slug)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)
  const [activeHeadingId, setActiveHeadingId] = useState(() => record?.headings[0]?.id ?? '')
  const progressRef = useRef<HTMLSpanElement>(null)
  const recordIndex = records.findIndex(item => item.slug === slug)
  const previousRecord = recordIndex >= 0 ? records[recordIndex + 1] : undefined
  const nextRecord = recordIndex > 0 ? records[recordIndex - 1] : undefined

  useEffect(() => {
    const progress = progressRef.current
    const headingElements = record?.headings
      .map(heading => document.getElementById(heading.id))
      .filter((heading): heading is HTMLElement => Boolean(heading)) ?? []

    const updateProgress = () => {
      if (!progress) {
        return
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const value = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
      progress.style.transform = `scaleX(${value})`
    }

    const headingObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(
          entries => {
            const visibleHeading = entries.find(entry => entry.isIntersecting)
            if (visibleHeading) {
              setActiveHeadingId(visibleHeading.target.id)
            }
          },
          { rootMargin: '-18% 0px -72% 0px' },
        )
      : null

    headingElements.forEach(heading => headingObserver?.observe(heading))
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })

    return () => {
      headingObserver?.disconnect()
      window.removeEventListener('scroll', updateProgress)
    }
  }, [record])

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src, alt })
  }

  const handleMarkdownClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) {
      return
    }

    const image = target.closest('img')
    if (!image || !event.currentTarget.contains(image)) {
      return
    }

    openLightbox(image.currentSrc || image.src, image.alt)
  }

  const handleImageKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    if (!(event.target instanceof HTMLImageElement)) {
      return
    }

    event.preventDefault()
    openLightbox(event.target.currentSrc || event.target.src, event.target.alt)
  }

  if (!record) {
    return (
      <main className="records-page">
        <div className="section-shell">
          <Link className="back-link" to="/blogs" viewTransition>
            <ArrowLeft size={17} />
            回到博客
          </Link>
          <section className="page-hero">
            <p className="soft-label">博客</p>
            <h1>没有找到这篇文章。</h1>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="record-article-page">
      <div className="reading-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <div className="section-shell">
        <Link className="back-link" to="/blogs" viewTransition>
          <ArrowLeft size={17} />
          回到博客
        </Link>

        <article className="record-article" data-reveal>
          <header>
            <p className="soft-label">{record.category}</p>
            <h1>{record.title}</h1>
            <p className="article-meta">
              {record.date ? <span>{record.date}</span> : null}
              <span>约 {record.readingMinutes} 分钟阅读</span>
            </p>
          </header>

          {record.cover ? (
            <img
              src={`${import.meta.env.BASE_URL}${record.cover}`}
              alt={record.alt}
              aria-label={`查看大图：${record.alt}`}
              role="button"
              tabIndex={0}
              onClick={event => openLightbox(event.currentTarget.currentSrc || event.currentTarget.src, record.alt)}
              onKeyDown={handleImageKeyDown}
            />
          ) : null}

          <div className="record-reading-layout">
            <div className="record-reading-main">
              {record.headings.length > 0 ? (
                <details className="article-toc-mobile">
                  <summary>文章目录</summary>
                  <nav aria-label="文章目录">
                    {record.headings.map(heading => (
                      <a className={heading.level === 3 ? 'is-subheading' : ''} key={heading.id} href={`#${heading.id}`}>
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </details>
              ) : null}

              <div
                className="markdown-body"
                onClick={handleMarkdownClick}
                onKeyDown={handleImageKeyDown}
                dangerouslySetInnerHTML={{ __html: record.contentHtml }}
              />
            </div>

            {record.headings.length > 0 ? (
              <aside className="article-toc">
                <p>文章目录</p>
                <nav aria-label="文章目录">
                  {record.headings.map(heading => (
                    <a
                      aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                      className={heading.level === 3 ? 'is-subheading' : ''}
                      key={heading.id}
                      href={`#${heading.id}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </aside>
            ) : null}
          </div>

          <nav className="article-pagination" aria-label="文章翻页">
            <Link to="/blogs" viewTransition>全部博客</Link>
            <div>
              {previousRecord ? <Link to={`/blogs/${previousRecord.slug}`} viewTransition>上一篇：{previousRecord.title}</Link> : null}
              {nextRecord ? <Link to={`/blogs/${nextRecord.slug}`} viewTransition>下一篇：{nextRecord.title}</Link> : null}
              <a href="#main-content">回到顶部 <ArrowUp size={15} aria-hidden="true" /></a>
            </div>
          </nav>
        </article>
      </div>

      {lightboxImage ? <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </main>
  )
}
