import { photos } from '@/data/photos.generated'
import EmptyState from '@/components/EmptyState'
import PhotoTransitionLink from '@/components/PhotoTransitionLink'

export default function PhotographyPage() {
  return (
    <main className="photography-page">
      <div className="section-shell">
        <section className="page-hero" data-reveal>
          <h1>摄影</h1>
          <p>{photos.length > 0 ? `${photos[0]?.date.slice(0, 4)} · ${photos.length} frame${photos.length > 1 ? 's' : ''}` : '生活里的片刻。'}</p>
        </section>

        {photos.length > 0 ? (
          <section className={`photography-gallery ${photos.length <= 2 ? 'is-featured' : ''}`} data-reveal="group" data-reveal-delay="1">
            {photos.map((photo, index) => (
              <PhotoTransitionLink
                className="photo-gallery-card"
                key={photo.src}
                slug={photo.slug}
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                loading="lazy"
              >
                <div>
                  <span className="soft-label">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{photo.title}</h2>
                  <p>{[photo.place, photo.date].filter(Boolean).join(' · ')}</p>
                  {photo.excerpt ? <p className="photo-excerpt">{photo.excerpt}</p> : null}
                </div>
              </PhotoTransitionLink>
            ))}
          </section>
        ) : (
          <EmptyState rows={4} />
        )}
      </div>
    </main>
  )
}
