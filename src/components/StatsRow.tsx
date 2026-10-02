import { Globe, ShieldAlert, Network, Brain } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { stats } from '@/data/content'

const ICONS = [
  <Globe size={16} strokeWidth={1.75} />,
  <ShieldAlert size={16} strokeWidth={1.75} />,
  <Network size={16} strokeWidth={1.75} />,
  <Brain size={16} strokeWidth={1.75} />,
]

function StatCard({
  value,
  suffix,
  label,
  icon,
}: {
  value: number
  suffix: string
  label: string
  icon: React.ReactNode
}) {
  const { count, ref } = useCountUp(value)
  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-3 py-4 rounded-card bg-[var(--surface)] border border-[var(--border)] shadow-card"
    >
      <span className="mb-1.5 text-[var(--primary)] opacity-70">{icon}</span>
      <span className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] tabular-nums leading-none">
        {count}{suffix}
      </span>
      <span className="mt-1.5 text-[11px] sm:text-xs text-[var(--body)] leading-snug max-w-[100px]">
        {label}
      </span>
    </div>
  )
}

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} icon={ICONS[i]} />
      ))}
    </div>
  )
}
