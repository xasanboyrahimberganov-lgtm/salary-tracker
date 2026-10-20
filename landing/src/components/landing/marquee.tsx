import { useRef } from "react"
import { motion, useScroll } from "motion/react"

import { useParallax } from "@/lib/motion"

const WORDS = ["Доходы", "Расходы", "Баланс", "Категории", "Графики"]
const ROW = [...WORDS, ...WORDS, ...WORDS].join(" · ")

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const forward = useParallax(scrollYProgress, 0, -900)
  const backward = useParallax(scrollYProgress, -900, 0)

  return (
    <div ref={ref} aria-hidden className="overflow-hidden py-20 select-none">
      <motion.p
        style={{ x: forward }}
        className="text-[clamp(3rem,10vw,8rem)] leading-none font-semibold tracking-tight whitespace-nowrap"
      >
        {ROW}
      </motion.p>
      <motion.p
        style={{ x: backward }}
        className="mt-2 text-[clamp(3rem,10vw,8rem)] leading-none font-semibold tracking-tight whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_var(--color-muted-foreground)]"
      >
        {ROW}
      </motion.p>
    </div>
  )
}
