import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type ImageLightboxProps = {
  image: {
    src: string
    alt: string
  }
  onClose: () => void
}

const closeDurationMs = 220

export default function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      return
    }

    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(onClose, closeDurationMs)
  }, [onClose])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [requestClose])

  const lightbox = (
    <div
      className={`image-lightbox ${isClosing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      onPointerDown={requestClose}
      onClick={requestClose}
    >
      <button
        className="image-lightbox-close"
        type="button"
        aria-label="关闭图片预览"
        onPointerDown={event => {
          event.stopPropagation()
          requestClose()
        }}
        onClick={event => event.stopPropagation()}
      >
        <X size={22} />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        onPointerDown={event => event.stopPropagation()}
        onClick={event => event.stopPropagation()}
      />
    </div>
  )

  return createPortal(lightbox, document.body)
}
