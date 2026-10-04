import { Globe, Webhook, Smartphone, Monitor, Cloud, Brain } from 'lucide-react'
import type { Project } from '@/data/projects'

/** Maps the icon key in projects.ts to a Lucide component. */
const ICONS = {
  globe: Globe,
  api: Webhook,
  smartphone: Smartphone,
  monitor: Monitor,
  cloud: Cloud,
  brain: Brain,
} as const

export function projectIcon(icon: Project['icon']) {
  return ICONS[icon] ?? Globe
}