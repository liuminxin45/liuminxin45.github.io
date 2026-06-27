import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion'
import { getViewTransitionDocument, prefersReducedMotion } from '@/lib/view-transitions'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const themeQuery = '(prefers-color-scheme: dark)'
const moonPath = 'M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z'
const sunPath = 'M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z'

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const stored = localStorage.getItem('theme')
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(themeQuery).matches ? 'dark' : 'light'
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(theme: ThemeMode) {
  const resolved = resolveTheme(theme)
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(getStoredTheme()))
  const reduceMotion = usePrefersReducedMotion()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') {
      return
    }

    const media = window.matchMedia(themeQuery)
    const handleSystemThemeChange = () => {
      const nextResolvedTheme = resolveTheme('system')
      setResolvedTheme(nextResolvedTheme)
      applyTheme('system')
    }

    media.addEventListener('change', handleSystemThemeChange)
    return () => media.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark'
    const applyNextTheme = () => {
      localStorage.setItem('theme', nextTheme)
      setTheme(nextTheme)
      setResolvedTheme(nextTheme)
      applyTheme(nextTheme)
    }

    const transitionDocument = getViewTransitionDocument()
    if (transitionDocument.startViewTransition && !prefersReducedMotion()) {
      document.documentElement.dataset.themeTransition = 'true'
      const transition = transitionDocument.startViewTransition(applyNextTheme)
      transition.finished.finally(() => {
        delete document.documentElement.dataset.themeTransition
      })
      return
    }

    applyNextTheme()
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle Dark Mode"
      title={theme === 'system' ? 'Toggle Dark Mode' : `Toggle Dark Mode (${theme})`}
      onClick={toggleTheme}
    >
      <motion.svg
        key={isDark ? 'sun' : 'moon'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, rotate: isDark ? -28 : 28, scale: 0.82 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 460, damping: 30, mass: 0.55 }}
      >
        <path d={isDark ? sunPath : moonPath} fillRule={isDark ? undefined : 'evenodd'} clipRule={isDark ? undefined : 'evenodd'} />
      </motion.svg>
    </button>
  )
}
