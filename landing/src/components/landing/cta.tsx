import { useRef } from "react"
import { motion, useScroll } from "motion/react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { APP_URL, REPO_URL } from "@/lib/links"
import { Reveal } from "@/components/landing/reveal"
import { useParallax } from "@/lib/motion"

const YEAR = new Date().getFullYear()

export function Cta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const glowY = useParallax(scrollYProgress, 140, -140)
  const glowX = useParallax(scrollYProgress, -80, 80)

  return (
    <section ref={ref} className="px-6 pb-16">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-card px-6 py-20 text-center sm:px-12">
        <motion.div
          aria-hidden
          style={{ y: glowY, x: glowX }}
          className="pointer-events-none absolute -top-20 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-income/30 to-expense/30 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Начните вести бюджет сегодня
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Регистрация занимает меньше минуты. Первая операция — ещё меньше.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="h-11 px-5 text-base">
              <a href={APP_URL}>
                Создать аккаунт <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-5 text-base">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Исходный код
              </a>
            </Button>
          </div>
        </div>
      </Reveal>

      <footer className="mx-auto mt-16 max-w-6xl">
        <Separator />
        <div className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {YEAR} Трекер доходов и расходов</p>
          <p>Neon · Vercel · shadcn/ui · Motion</p>
        </div>
      </footer>
    </section>
  )
}
