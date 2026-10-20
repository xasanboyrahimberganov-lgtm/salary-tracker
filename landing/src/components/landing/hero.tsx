import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"

import { DashboardMock } from "@/components/landing/dashboard-mock"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { APP_URL } from "@/lib/links"
import { EASE, useParallax } from "@/lib/motion"

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  const glowA = useParallax(progress, 0, 320)
  const glowB = useParallax(progress, 0, -220)
  const gridY = useParallax(progress, 0, 160)
  const textY = useParallax(progress, 0, 220)
  const textOpacity = useTransform(progress, [0, 0.55], [1, 0])
  const mockY = useParallax(progress, 0, -120)
  const mockTilt = useParallax(progress, 16, 0, 0)
  const mockScale = useParallax(progress, 0.94, 1.04, 1)
  const chipFast = useParallax(progress, 0, -260)
  const chipSlow = useParallax(progress, 0, -90)

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        style={{ y: glowA }}
        className="pointer-events-none absolute -top-24 -left-32 -z-10 size-[28rem] rounded-full bg-income/25 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: glowB }}
        className="pointer-events-none absolute top-64 -right-32 -z-10 size-[26rem] rounded-full bg-expense/25 blur-3xl"
      />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Badge variant="secondary" className="mb-6">
            Neon Postgres · Vercel · личный аккаунт
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
        >
          Деньги под контролем —{" "}
          <span className="bg-gradient-to-r from-income to-expense bg-clip-text text-transparent">
            в одном дашборде
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground"
        >
          Записывайте доходы и расходы, смотрите графики по дням и категориям. Данные хранятся в
          облаке и доступны с любого устройства после входа.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button size="lg" asChild className="h-11 px-5 text-base">
            <a href={APP_URL}>
              Начать бесплатно <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-11 px-5 text-base">
            <a href="#features">Что умеет трекер</a>
          </Button>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto mt-16 max-w-4xl px-6 [perspective:1400px]">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          <motion.div style={{ y: mockY, rotateX: mockTilt, scale: mockScale }} className="origin-top">
            <DashboardMock />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: chipFast }}
          className="absolute -top-6 left-0 hidden items-center gap-2 rounded-xl border bg-card/90 px-3 py-2 text-sm shadow-lg backdrop-blur sm:flex"
        >
          <TrendingUp className="size-4 text-income" />
          <span className="font-medium text-income">+5 000 000 сум</span>
          <span className="text-muted-foreground">Зарплата</span>
        </motion.div>
        <motion.div
          style={{ y: chipSlow }}
          className="absolute right-0 -bottom-6 hidden items-center gap-2 rounded-xl border bg-card/90 px-3 py-2 text-sm shadow-lg backdrop-blur sm:flex"
        >
          <TrendingDown className="size-4 text-expense" />
          <span className="font-medium text-expense">−120 000 сум</span>
          <span className="text-muted-foreground">Еда</span>
        </motion.div>
      </div>
    </section>
  )
}
