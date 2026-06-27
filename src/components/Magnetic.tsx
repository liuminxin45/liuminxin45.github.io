import { type PropsWithChildren, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion'

type MagneticProps = PropsWithChildren<{
  className?: string
  strength?: number
}>

export default function Magnetic({ children, className, strength = 7 }: MagneticProps) {
  const reduceMotion = usePrefersReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 210, damping: 20, mass: 0.42 })
  const y = useSpring(rawY, { stiffness: 210, damping: 20, mass: 0.42 })

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || event.pointerType === 'touch') {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2

    rawX.set((offsetX / rect.width) * strength)
    rawY.set((offsetY / rect.height) * strength)
  }

  return (
    <motion.span
      className={className}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
    >
      {children}
    </motion.span>
  )
}
