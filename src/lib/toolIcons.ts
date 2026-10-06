import {
  Shield,
  Radar,
  FolderSearch,
  Database,
  Network,
  KeyRound,
  Code2,
  Send,
  Activity,
  ScanSearch,
  Blocks,
} from 'lucide-react'
import type { ToolUse } from '@/data/projects'

/**
 * Maps a tool name from projects.ts to a Lucide component.
 * Falls back to Shield for any tool that is not listed here.
 */
const ICONS: Record<string, typeof Shield> = {
  'Burp Suite': Shield,
  InsightAppSec: Radar,
  Gobuster: FolderSearch,
  SQLMap: Database,
  Nmap: Network,
  Hydra: KeyRound,
  Python: Code2,
  Postman: Send,
  Wireshark: Activity,
  'Tenable.io': ScanSearch,
  'LLM-assisted tooling': Blocks,
}

export function toolIcon(name: ToolUse['name']) {
  return ICONS[name] ?? Shield
}
