import { useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import ImageLightbox from '@/components/ImageLightbox'
import { records } from '@/data/records.generated'

export default function RecordArticlePage() {
  const { slug } = useParams()
  const record = records.find(item => item.slug === slug)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

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
      <div className="section-shell">
        <Link className="back-link" to="/blogs" viewTransition>
          <ArrowLeft size={17} />
          回到博客
        </Link>

        <article className="record-article">
          <header>
            <p className="soft-label">{record.category}</p>
            <h1>{record.title}</h1>
            {record.date ? <p>{record.date}</p> : null}
          </header>

          {record.cover ? (
            <img
              src={`${import.meta.env.BASE_URL}${record.cover}`}
              alt={record.alt}
              onClick={event => openLightbox(event.currentTarget.currentSrc || event.currentTarget.src, record.alt)}
            />
          ) : null}

          <div
            className="markdown-body"
            onClick={handleMarkdownClick}
            dangerouslySetInnerHTML={{ __html: record.contentHtml }}
          />
        </article>
      </div>

      {lightboxImage ? <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </main>
  )
}
