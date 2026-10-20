import { useRef } from "react"
import { motion, useScroll } from "motion/react"
import { Database, KeyRound, Palette, Server, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Reveal } from "@/components/landing/reveal"
import { useMediaQuery, useParallax } from "@/lib/motion"

const STACK: { icon: LucideIcon; title: string; text: string; tags: string[] }[] = [
  {
    icon: Database,
    title: "Neon Postgres",
    text: "Serverless Postgres: таблицы пользователей и операций, запросы всегда ограничены владельцем.",
    tags: ["SQL", "serverless"],
  },
  {
    icon: Server,
    title: "Vercel Functions",
    text: "REST API для входа и CRUD работает рядом со статикой, без отдельного сервера.",
    tags: ["Node.js", "API"],
  },
  {
    icon: KeyRound,
    title: "JWT + bcrypt",
    text: "Пароли не хранятся в открытом виде, сессия подписана и живёт 7 дней.",
    tags: ["httpOnly", "HS256"],
  },
  {
    icon: Palette,
    title: "Чистый фронтенд",
    text: "Трекер — HTML, CSS и JS без фреймворков, графики рисуются в SVG.",
    tags: ["SVG", "без сборки"],
  },
]

export function Stack() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const evenY = useParallax(scrollYProgress, 60, -60, 0)
  const oddY = useParallax(scrollYProgress, -40, 80, 0)
  const zigzag = useMediaQuery("(min-width: 1024px)")

  return (
    <section ref={ref} id="stack" className="scroll-mt-20 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-income">Технологии</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Простой и надёжный стек</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Минимум зависимостей в трекере и проверенные облачные сервисы под капотом.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((item, index) => (
            <motion.div key={item.title} style={zigzag ? { y: index % 2 === 0 ? evenY : oddY } : undefined}>
              <Reveal delay={index * 0.08} className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <item.icon className="mb-3 size-6 text-income" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{item.text}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </Reveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
