import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import ImageLightbox from '@/components/ImageLightbox'
import { photos } from '@/data/photos.generated'
import { getPhotoTransitionName } from '@/lib/view-transitions'

type PhotoTransitionStyle = CSSProperties & {
  '--photo-view-transition-name': string
}

export default function PhotoArticlePage() {
  const { slug } = useParams()
  const photo = photos.find(item => item.slug === slug)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  const handleImageKeyDown = (event: KeyboardEvent<HTMLImageElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    setLightboxImage({ src: event.currentTarget.currentSrc || event.currentTarget.src, alt: photo?.alt ?? '' })
  }

  if (!photo) {
    return (
      <main className="photography-page">
        <div className="section-shell">
          <Link className="back-link" to="/photography" viewTransition>
            <ArrowLeft size={17} />
            回到摄影
          </Link>
          <section className="page-hero">
            <p className="soft-label">摄影</p>
            <h1>没有找到这张照片。</h1>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="photo-article-page">
      <div className="section-shell">
        <Link className="back-link" to="/photography" viewTransition>
          <ArrowLeft size={17} />
          回到摄影
        </Link>

        <article className="photo-article photo-article-layout" data-reveal>
          <img
            className="photo-transition-target"
            src={`${import.meta.env.BASE_URL}${photo.src}`}
            alt={photo.alt}
            aria-label={`查看大图：${photo.alt}`}
            role="button"
            tabIndex={0}
            style={{ '--photo-view-transition-name': getPhotoTransitionName(photo.slug) } as PhotoTransitionStyle}
            onClick={event => setLightboxImage({ src: event.currentTarget.currentSrc || event.currentTarget.src, alt: photo.alt })}
            onKeyDown={handleImageKeyDown}
          />

          <header>
            <p className="soft-label">摄影</p>
            <h1>{photo.title}</h1>
            <dl className="photo-meta">
              {photo.date ? <><dt>日期</dt><dd>{photo.date}</dd></> : null}
              {photo.place ? <><dt>地点</dt><dd>{photo.place}</dd></> : null}
            </dl>
            {photo.contentHtml ? (
              <div className="photo-note" dangerouslySetInnerHTML={{ __html: photo.contentHtml }} />
            ) : null}
          </header>
        </article>
      </div>

      {lightboxImage ? <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </main>
  )
}
