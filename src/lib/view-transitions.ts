export type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

type MotionMode = 'system' | 'full' | 'reduce'

const motionStorageKey = 'motion'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function getPhotoTransitionName(slug: string) {
  return `photo-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

function isMotionMode(value: string | null): value is MotionMode {
  return value === 'system' || value === 'full' || value === 'reduce'
}

function getStoredMotionMode(): MotionMode {
  const stored = localStorage.getItem(motionStorageKey)
  return isMotionMode(stored) ? stored : 'system'
}

export function syncMotionPreferenceFromUrl() {
  const motionParam = new URLSearchParams(window.location.search).get('motion')

  if (isMotionMode(motionParam)) {
    if (motionParam === 'system') {
      localStorage.removeItem(motionStorageKey)
    } else {
      localStorage.setItem(motionStorageKey, motionParam)
    }
  }

  const motionMode = getStoredMotionMode()
  document.documentElement.classList.toggle('motion-full', motionMode === 'full')
  document.documentElement.classList.toggle('motion-reduce', motionMode === 'reduce')

  return motionMode
}

export function prefersReducedMotion() {
  const motionMode = getStoredMotionMode()

  if (motionMode === 'full') {
    return false
  }

  if (motionMode === 'reduce') {
    return true
  }

  return window.matchMedia(reducedMotionQuery).matches
}

export function getViewTransitionDocument() {
  return document as ViewTransitionDocument
}

export function hasViewTransitionApi() {
  return typeof getViewTransitionDocument().startViewTransition === 'function'
}
