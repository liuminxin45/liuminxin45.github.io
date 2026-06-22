import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { photos } from '@/data/photos.generated'
import EmptyState from '@/components/EmptyState'

export default function PhotographyPage() {
  return (
    <main className="photography-page">
      <div className="section-shell">
        <Link className="back-link" to="/" viewTransition>
          <ArrowLeft size={17} />
          回到首页
        </Link>

        <section className="page-hero">
          <h1>摄影</h1>
          <p>{photos.length} 张</p>
        </section>

        {photos.length > 0 ? (
          <section className="photography-gallery">
            {photos.map(photo => (
              <Link className="photo-gallery-card" key={photo.src} to={`/photography/${photo.slug}`} viewTransition>
                <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" />
                <div>
                  <h2>{photo.title}</h2>
                  <p>{[photo.place, photo.date].filter(Boolean).join(' · ')}</p>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <EmptyState rows={4} />
        )}
      </div>
    </main>
  )
}
