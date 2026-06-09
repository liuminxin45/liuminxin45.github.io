import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { photos } from '@/data/photos.generated'

export default function PhotoArticlePage() {
  const { slug } = useParams()
  const photo = photos.find(item => item.slug === slug)

  if (!photo) {
    return (
      <main className="photography-page">
        <div className="section-shell">
          <Link className="back-link" to="/photography">
            <ArrowLeft size={17} />
            回到摄影
          </Link>
          <section className="work-hero">
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
        <Link className="back-link" to="/photography">
          <ArrowLeft size={17} />
          回到摄影
        </Link>

        <article className="photo-article">
          <header>
            <p className="soft-label">摄影</p>
            <h1>{photo.title}</h1>
            {photo.place || photo.date ? <p>{[photo.place, photo.date].filter(Boolean).join(' · ')}</p> : null}
          </header>

          <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} />

          {photo.contentHtml ? (
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: photo.contentHtml }} />
          ) : (
            <div className="markdown-body">
              <p>这张照片还没有文字。</p>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
