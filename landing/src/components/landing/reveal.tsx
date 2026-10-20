import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

import { EASE } from "@/lib/motion"

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; offset?: number }

export function Reveal({ delay = 0, offset = 28, ...props }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...props}
    />
  )
}
