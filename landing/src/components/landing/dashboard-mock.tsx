import { motion } from "motion/react"

import { EASE } from "@/lib/motion"

const STATS = [
  { label: "Доход", value: "12 400 000 сум", tone: "text-income" },
  { label: "Расход", value: "7 850 000 сум", tone: "text-expense" },
  { label: "Баланс", value: "4 550 000 сум", tone: "text-foreground" },
]

const BARS = [
  [62, 38],
  [40, 52],
  [78, 30],
  [55, 64],
  [90, 41],
  [48, 58],
  [70, 35],
]

const SLICES = [
  { share: 0.34, color: "#e4572e", label: "Жильё" },
  { share: 0.24, color: "#f3a712", label: "Еда" },
  { share: 0.16, color: "#29a19c", label: "Транспорт" },
  { share: 0.14, color: "#7b61ff", label: "Покупки" },
  { share: 0.12, color: "#3f88c5", label: "Другое" },
]

const SLICE_STARTS = SLICES.map((_, index) =>
  SLICES.slice(0, index).reduce((sum, slice) => sum + slice.share, 0),
)

const RADIUS = 15.9155

export function DashboardMock() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-2xl shadow-black/10 sm:p-6 dark:shadow-black/40">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-expense/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-income/70" />
        </div>
        <span className="text-xs text-muted-foreground">Октябрь 2026</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-muted/60 p-3">
            <p className="text-[11px] text-muted-foreground sm:text-xs">{stat.label}</p>
            <p className={`mt-1 text-xs font-semibold sm:text-base ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="mb-3 text-xs text-muted-foreground">По дням месяца</p>
          <div className="flex h-32 items-end gap-2 sm:h-40">
            {BARS.map(([income, expense], index) => (
              <div key={index} className="flex h-full flex-1 items-end gap-0.5">
                <motion.span
                  className="flex-1 rounded-t-sm bg-income"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${income}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3 + index * 0.06, ease: EASE }}
                />
                <motion.span
                  className="flex-1 rounded-t-sm bg-expense"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${expense}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.35 + index * 0.06, ease: EASE }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3 sm:flex-col sm:items-stretch">
          <p className="hidden text-xs text-muted-foreground sm:block">Расходы по категориям</p>
          <svg viewBox="0 0 42 42" className="size-24 shrink-0 -rotate-90 sm:mx-auto sm:size-28">
            {SLICES.map((slice, index) => (
              <motion.circle
                key={slice.label}
                cx="21"
                cy="21"
                r={RADIUS / 2}
                fill="none"
                stroke={slice.color}
                strokeWidth={RADIUS}
                pathLength={1}
                strokeDasharray={`${slice.share} 1`}
                strokeDashoffset={-SLICE_STARTS[index]}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.08, ease: EASE }}
                style={{ transformOrigin: "21px 21px" }}
              />
            ))}
          </svg>
          <ul className="grid gap-1 text-[11px] text-muted-foreground">
            {SLICES.slice(0, 4).map((slice) => (
              <li key={slice.label} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: slice.color }} />
                {slice.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
