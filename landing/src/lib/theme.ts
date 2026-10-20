import { useCallback, useState } from "react"

const THEME_KEY = "salary-tracker-theme"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  )

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark"
      document.documentElement.classList.toggle("dark", next === "dark")
      localStorage.setItem(THEME_KEY, next)
      return next
    })
  }, [])

  return { theme, toggle }
}
