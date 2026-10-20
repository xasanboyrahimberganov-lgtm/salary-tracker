import { useRef } from "react"
import { motion, useScroll } from "motion/react"
import {
  ChartColumn,
  ChartPie,
  Cloud,
  ListChecks,
  MoonStar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Reveal } from "@/components/landing/reveal"
import { useParallax } from "@/lib/motion"

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ChartColumn,
    title: "Дашборд за месяц",
    text: "Доход, расход и баланс сразу видны наверху. Столбчатый график показывает движение денег по дням.",
  },
  {
    icon: ChartPie,
    title: "Категории на pie-графиках",
    text: "Отдельные круговые графики для доходов и расходов с яркими, легко различимыми цветами.",
  },
  {
    icon: ListChecks,
    title: "Полный CRUD",
    text: "Добавляйте, редактируйте и удаляйте операции. Список фильтруется по выбранному месяцу.",
  },
  {
    icon: Cloud,
    title: "Данные в облаке",
    text: "Операции хранятся в Neon Postgres. Войдите с телефона или ноутбука — всё на месте.",
  },
  {
    icon: ShieldCheck,
    title: "Личный аккаунт",
    text: "Пароли хешируются bcrypt, сессия живёт в httpOnly-cookie. Каждый видит только свои данные.",
  },
  {
    icon: MoonStar,
    title: "Светлая и тёмная тема",
    text: "Тема запоминается и совпадает в трекере и на этой странице.",
  },
]

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const ringY = useParallax(scrollYProgress, -120, 200)
  const dotsY = useParallax(scrollYProgress, 160, -160)

  return (
    <section ref={ref} id="features" className="relative scroll-mt-20 overflow-hidden py-28">
      <motion.div
        aria-hidden
        style={{ y: ringY }}
        className="pointer-events-none absolute top-10 -right-40 -z-10 size-[30rem] rounded-full border-[48px] border-income/10"
      />
      <motion.div
        aria-hidden
        style={{ y: dotsY }}
        className="pointer-events-none absolute bottom-0 -left-10 -z-10 size-72 bg-[radial-gradient(var(--color-expense)_1.5px,transparent_1.5px)] bg-[size:18px_18px] opacity-30"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-income">Возможности</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Всё, что нужно для учёта личных финансов
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 3) * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="h-full">
                  <CardHeader>
                    <span className="mb-3 grid size-10 place-items-center rounded-lg bg-muted">
                      <feature.icon className="size-5" />
                    </span>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{feature.text}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
