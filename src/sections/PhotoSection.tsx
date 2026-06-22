import { Link } from 'react-router'
import EmptyState from '@/components/EmptyState'
import { photos } from '@/data/photos.generated'

const previewPhotos = photos.slice(0, 4)

export default function PhotoSection() {
  return (
    <section id="photo-preview" className="section-block photo-section">
      <div className="site-container">
        <div className="section-heading with-link">
          <div>
            <h2>摄影</h2>
          </div>
          {photos.length > 0 ? <Link to="/photography" viewTransition>全部摄影 →</Link> : null}
        </div>

        {photos.length > 0 ? (
          <div className="photo-grid">
            {previewPhotos.map(photo => (
              <Link className="photo-card" key={photo.src} to={`/photography/${photo.slug}`} viewTransition>
                <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" />
                <span>
                  <strong>{photo.title}</strong>
                  {photo.place || photo.date ? <small>{[photo.place, photo.date].filter(Boolean).join(' · ')}</small> : null}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState rows={4} />
        )}
      </div>
    </section>
  )
}
