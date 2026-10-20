import { useSyncExternalStore } from "react"
import { useReducedMotion, useTransform, type MotionValue } from "motion/react"

export const EASE = [0.22, 1, 0.36, 1] as const

export function useParallax(
  progress: MotionValue<number>,
  from: number,
  to: number,
  still = from,
) {
  const reduce = useReducedMotion()
  return useTransform(progress, [0, 1], reduce ? [still, still] : [from, to])
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
