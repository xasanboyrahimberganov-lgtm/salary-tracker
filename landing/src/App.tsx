import { Cta } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { Nav } from "@/components/landing/nav"
import { Stack } from "@/components/landing/stack"
import { Steps } from "@/components/landing/steps"
import { useTheme } from "@/lib/theme"

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <Features />
        <Steps />
        <Marquee />
        <Stack />
        <Cta />
      </main>
    </>
  )
}
