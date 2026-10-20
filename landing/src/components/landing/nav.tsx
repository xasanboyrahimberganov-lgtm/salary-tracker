import { useState } from "react"
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react"
import { Moon, Sun, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { APP_URL } from "@/lib/links"
import type { Theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#features", label: "Возможности" },
  { href: "#how", label: "Как это работает" },
  { href: "#stack", label: "Технологии" },
]

type NavProps = { theme: Theme; onToggleTheme: () => void }

export function Nav({ theme, onToggleTheme }: NavProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24))

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b bg-background/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#top" aria-label="Трекер финансов" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          <span className="hidden sm:inline">Трекер финансов</span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button asChild>
            <a href={APP_URL}>Открыть трекер</a>
          </Button>
        </div>
      </nav>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-income"
        style={{ scaleX: progress }}
      />
    </header>
  )
}
