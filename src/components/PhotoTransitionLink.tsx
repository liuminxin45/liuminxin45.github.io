import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { getPhotoTransitionName, prefersReducedMotion } from '@/lib/view-transitions'

type PhotoTransitionLinkProps = Omit<LinkProps, 'to' | 'children'> & {
  alt: string
  children?: ReactNode
  imageClassName?: string
  loading?: 'eager' | 'lazy'
  slug: string
  src: string
  to?: LinkProps['to']
}

export default function PhotoTransitionLink({
  alt,
  children,
  imageClassName,
  loading,
  onClickCapture,
  onPointerDownCapture,
  slug,
  src,
  to,
  ...linkProps
}: PhotoTransitionLinkProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  const primeImageTransition = () => {
    const image = imageRef.current
    if (!image || prefersReducedMotion()) {
      return
    }

    image.style.setProperty('view-transition-name', getPhotoTransitionName(slug))

    window.setTimeout(() => {
      if (image.isConnected) {
        image.style.removeProperty('view-transition-name')
      }
    }, 900)
  }

  const handlePointerDownCapture = (event: PointerEvent<HTMLAnchorElement>) => {
    primeImageTransition()
    onPointerDownCapture?.(event)
  }

  const handleClickCapture = (event: MouseEvent<HTMLAnchorElement>) => {
    primeImageTransition()
    onClickCapture?.(event)
  }

  return (
    <Link
      {...linkProps}
      to={to ?? `/photography/${slug}`}
      viewTransition
      onPointerDownCapture={handlePointerDownCapture}
      onClickCapture={handleClickCapture}
    >
      <img ref={imageRef} className={imageClassName} src={src} alt={alt} loading={loading} />
      {children}
    </Link>
  )
}
