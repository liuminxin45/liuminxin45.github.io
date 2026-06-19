import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, X } from 'lucide-react'
import { records } from '@/data/records.generated'

export default function RecordArticlePage() {
  const { slug } = useParams()
  const record = records.find(item => item.slug === slug)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!lightboxImage) {
      return
    }

    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxImage(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxImage])

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
          <Link className="back-link" to="/records">
            <ArrowLeft size={17} />
            回到记录
          </Link>
          <section className="work-hero">
            <p className="soft-label">记录</p>
            <h1>没有找到这篇文章。</h1>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="record-article-page">
      <div className="section-shell">
        <Link className="back-link" to="/records">
          <ArrowLeft size={17} />
          回到记录
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

      {lightboxImage ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxImage(null)}>
          <button
            className="image-lightbox-close"
            type="button"
            aria-label="关闭图片预览"
            onClick={() => setLightboxImage(null)}
          >
            <X size={22} />
          </button>
          <img src={lightboxImage.src} alt={lightboxImage.alt} onClick={event => event.stopPropagation()} />
        </div>
      ) : null}
    </main>
  )
}
