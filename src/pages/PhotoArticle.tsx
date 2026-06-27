import { useState, type CSSProperties } from 'react'
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

        <article className="photo-article">
          <header>
            <p className="soft-label">摄影</p>
            <h1>{photo.title}</h1>
            {photo.place || photo.date ? <p>{[photo.place, photo.date].filter(Boolean).join(' · ')}</p> : null}
          </header>

          <img
            className="photo-transition-target"
            src={`${import.meta.env.BASE_URL}${photo.src}`}
            alt={photo.alt}
            style={{ '--photo-view-transition-name': getPhotoTransitionName(photo.slug) } as PhotoTransitionStyle}
            onClick={event => setLightboxImage({ src: event.currentTarget.currentSrc || event.currentTarget.src, alt: photo.alt })}
          />

          {photo.contentHtml ? (
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: photo.contentHtml }} />
          ) : null}
        </article>
      </div>

      {lightboxImage ? <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </main>
  )
}
