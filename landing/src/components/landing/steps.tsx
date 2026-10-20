import { useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STEPS = [
  { title: "Зарегистрируйтесь", text: "Email и пароль — больше ничего. Аккаунт создаётся за секунду." },
  { title: "Добавьте операцию", text: "Тип, сумма, категория и дата. Комментарий — по желанию." },
  { title: "Смотрите графики", text: "Дашборд и pie-графики сразу пересчитываются за выбранный месяц." },
  { title: "Правьте и удаляйте", text: "Ошиблись? Измените запись в списке операций в один клик." },
]

function StepCard({ index, title, text }: { index: number; title: string; text: string }) {
  return (
    <Card className="h-full w-[min(80vw,24rem)] shrink-0">
      <CardContent className="flex h-full flex-col gap-4 py-2">
        <span className="text-6xl font-semibold text-muted-foreground/30 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}

export function Steps() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(track)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const bar = useTransform(smooth, [0, 1], [0, 1])
  const horizontal = !reduce

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative scroll-mt-16 bg-muted/40"
      style={horizontal ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={cn("overflow-hidden", horizontal && "sticky top-0 flex h-screen flex-col justify-center")}>
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <p className="text-sm font-medium text-income">Как это работает</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Четыре шага до порядка в деньгах</h2>
          {horizontal && (
            <div className="mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-border">
              <motion.div className="h-full origin-left rounded-full bg-income" style={{ scaleX: bar }} />
            </div>
          )}
        </div>
        <motion.div
          ref={trackRef}
          style={horizontal ? { x } : undefined}
          className={cn(
            "flex gap-5 px-6 pb-16 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]",
            horizontal ? "w-max" : "flex-wrap",
          )}
        >
          {STEPS.map((step, index) => (
            <StepCard key={step.title} index={index} {...step} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
