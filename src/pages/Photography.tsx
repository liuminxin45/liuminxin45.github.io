import { photos } from '@/data/photos.generated'
import EmptyState from '@/components/EmptyState'
import PhotoTransitionLink from '@/components/PhotoTransitionLink'

export default function PhotographyPage() {
  return (
    <main className="photography-page">
      <div className="section-shell">
        <section className="page-hero">
          <h1>摄影</h1>
        </section>

        {photos.length > 0 ? (
          <section className="photography-gallery">
            {photos.map(photo => (
              <PhotoTransitionLink
                className="photo-gallery-card"
                key={photo.src}
                slug={photo.slug}
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                loading="lazy"
              >
                <div>
                  <h2>{photo.title}</h2>
                  <p>{[photo.place, photo.date].filter(Boolean).join(' · ')}</p>
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
