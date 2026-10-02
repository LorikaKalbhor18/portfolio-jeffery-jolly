// Client details intentionally generic
import type { IconType } from 'react-icons'
import { SiOwasp } from 'react-icons/si'
import type { LucideIcon } from 'lucide-react'
import { Brain, Database, FolderSearch, Gauge, KeyRound, Radar, ScanLine, Target, Webhook, Wrench } from 'lucide-react'

export type SkillIcon = IconType | LucideIcon

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

export type SkillEntry =
  | { type: 'img'; src: string; bg?: string }
  | { type: 'icon'; icon: SkillIcon; color: string; bg?: string }

export const skillToolEntries: Record<string, SkillEntry> = {
  'Burp Suite':    { type: 'img', src: '/icons/burpsuite.svg', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  'Metasploit':   { type: 'img', src: '/icons/metasploit.svg', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'Wireshark':    { type: 'img', src: '/icons/wireshark.svg', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'Postman':      { type: 'img', src: `${CDN}/postman/postman-original.svg`, bg: 'bg-orange-50 dark:bg-orange-950/30' },
  'Python':       { type: 'img', src: `${CDN}/python/python-original.svg`, bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
  'Kali Linux':   { type: 'img', src: `${CDN}/kalilinux/kalilinux-original.svg`, bg: 'bg-slate-100 dark:bg-slate-800/50' },
  'JSON':         { type: 'img', src: `${CDN}/json/json-original.svg`, bg: 'bg-slate-50 dark:bg-slate-800/30' },
  'Nmap':         { type: 'icon', icon: Radar, color: '#4A90D9', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'SQLMap':       { type: 'icon', icon: Database, color: '#E74C3C', bg: 'bg-red-50 dark:bg-red-950/30' },
  'Tenable.io':   { type: 'img', src: '/icons/tenable.svg', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  'InsightAppSec':{ type: 'icon', icon: ScanLine, color: '#E8432D', bg: 'bg-red-50 dark:bg-red-950/30' },
  'Gobuster':     { type: 'icon', icon: FolderSearch, color: '#6366F1', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  'Hydra':        { type: 'icon', icon: KeyRound, color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  'REST APIs':    { type: 'icon', icon: Webhook, color: '#10B981', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
}

export const skillFrameworkEntries: Record<string, SkillEntry> = {
  'OWASP Top 10':              { type: 'icon', icon: SiOwasp, color: '#004FFF', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'OWASP API Top 10':          { type: 'icon', icon: SiOwasp, color: '#004FFF', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'OWASP Mobile Top 10':       { type: 'icon', icon: SiOwasp, color: '#004FFF', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  'OWASP Top 10 for LLM Apps': { type: 'icon', icon: Brain, color: '#9333EA', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  'CVSS v3.1':                 { type: 'icon', icon: Gauge, color: '#DC2626', bg: 'bg-red-50 dark:bg-red-950/30' },
  'MITRE ATT\u0026CK':         { type: 'icon', icon: Target, color: '#1D4ED8', bg: 'bg-blue-50 dark:bg-blue-950/30' },
}

// Legacy — kept so any other file importing these doesn't break
export type { SkillIcon as _SkillIcon }
export const skillToolIcons: Record<string, SkillIcon> = Object.fromEntries(
  Object.entries(skillToolEntries).map(([k, v]) => [k, v.type === 'icon' ? v.icon : Wrench])
)
export const skillFrameworkIcons: Record<string, SkillIcon> = Object.fromEntries(
  Object.entries(skillFrameworkEntries).map(([k, v]) => [k, v.type === 'icon' ? v.icon : Wrench])
)
export const fallbackSkillIcon = Wrench

export const navLinks = [
  { label: 'Home',           href: '#home' },
  { label: 'About',          href: '#about' },
  { label: 'Experience',     href: '#experience' },
  { label: 'Projects',       href: '#projects' },
  { label: 'Skills',         href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Blog',           href: '#blog' },
  { label: 'Contact',        href: '#contact' },
]

export const siteConfig = {
  name: 'Jeffrey Jolly',
  role: 'Penetration Tester | Cybersecurity Analyst',
  location: 'Bhubaneswar, India',
  email: 'jeffryjolly@gmail.com',
  // Update these placeholder URLs before going live
  linkedin: 'https://linkedin.com/in/jeffrey-jolly',
  github: 'https://github.com/jeffrey-jolly',
  medium: 'https://medium.com/@jeffryjolly',
  resumeUrl: '/resume.pdf',
}

const contactRetentionDays = 90

export const contactPrivacy = {
  retentionDays: contactRetentionDays,
  summary: `Your name, email and message are used only to reply to you. They are sent to my email through Formspree and kept for up to ${contactRetentionDays} days, then deleted. I don't share them or use them for marketing.`,
  collected: 'Name, email, selected topic, and message.',
  purpose: 'The details are used only to reply to your message.',
  destination: `Submissions are processed by Formspree and sent to ${siteConfig.email}.`,
  retention: `Submissions are kept for up to ${contactRetentionDays} days, then deleted.`,
  deletion: `To ask for deletion, email ${siteConfig.email}.`,
  mockMode: 'In local mock mode, submissions are logged to the browser console and are not sent or stored.',
}

export const hero = {
  eyebrow: 'Penetration Tester | Cybersecurity Analyst',
  headlineLine1: 'Find Vulnerabilities.',
  headlineLine2: 'Build Safer Systems.',
  roles: ['Penetration Tester', 'Cybersecurity Analyst', 'AI/LLM Security Tester'],
  subline:
    'I help organisations identify, exploit and fix real-world vulnerabilities across Web, API, Mobile, Thick Client, Network, Cloud and AI/LLM systems.',
  ctaPrimary: 'View my work',
  ctaSecondary: 'Download resume',
}

export const stats = [
  { value: 50, suffix: '+', label: 'Web applications tested' },
  { value: 70, suffix: '+', label: 'Vulnerabilities documented' },
  { value: 150, suffix: '+', label: 'Network hosts assessed' },
  { value: 10, suffix: '+', label: 'Assessments using AI-assisted tooling' },
]

export const about = {
  eyebrow: 'About me',
  heading: 'Curious. Hands-on.',
  headingBlue: 'Always learning.',
  lead: 'From the backwaters of Kerala to breaking into systems for a living. With permission, of course.',
  paragraphs: [
    "I'm Jeffrey, a penetration tester from Alappuzha, Kerala, now working in Bhubaneswar. I have 4+ years of experience in vulnerability assessment and penetration testing across web, API, mobile, thick client, network, cloud and AI/LLM systems. I speak English, German, Malayalam and Hindi, so I can work with teams in more than one language.",
    'I like the whole loop. I find the weakness, prove it can be exploited, document it with clear steps and evidence, and help the team fix it and retest. A good report matters as much as a good exploit, because a finding nobody understands never gets fixed.',
  ],
  moreParagraphs: [
    "I started at EY GDS in Kochi, testing client applications against the OWASP Top 10. Today I'm a Cybersecurity Analyst at Tata Consultancy Services, where my work ranges from web applications and network hosts to onsite device assessments and LLM applications.",
    "AI is changing what needs to be secured. I test LLM applications for prompt injection and sensitive data leakage, and I use LLM tools to speed up payload generation and triage. I also write Python to automate repetitive analysis, and I'm preparing for the CRTP certification (target Jan 2027).",
    "Outside work, I enjoy solving CTFs, and I was a core team member of TCS HackQuest, a national-level CTF organized by TCS, where I introduced dynamic flagging that cut flag leakage by 80%. I've also recently started writing blogs, sharing what I learn along the way. If you have a security question, a CTF idea or an application that needs a second pair of eyes, I'd love to hear from you.",
  ],
  readMoreLabel: 'Read more',
  showLessLabel: 'Show less',
  latestArticlesLabel: 'Read my latest articles',
  values: [
    { label: 'Problem solver',     icon: 'Puzzle',   desc: 'Breaking things to make them stronger.' },
    { label: 'Continuous learner', icon: 'BookOpen', desc: 'Adding AI/LLM security to my toolkit.' },
    { label: 'Real-world focus',   icon: 'Target',   desc: 'Reports teams can actually act on.' },
    { label: 'Team player',        icon: 'Users',    desc: 'Helping run the HackQuest CTF.' },
  ],
  chipGroups: [
    { label: 'Location', chips: ['From Alappuzha, Kerala', 'Based in Bhubaneswar, India'] },
    { label: 'Languages', chips: ['English', 'German', 'Malayalam', 'Hindi'] },
    { label: 'Interests', chips: ['Solving CTFs', 'Writing blogs'] },
    { label: 'Status', chips: ['Open to opportunities'] },
    { label: 'Currently', chips: ['Preparing for CRTP (target Jan 2027)'] },
  ],
  downloadLabel: 'Download resume',
  contactLabel: "Let's talk",
}

export const experience = [
  {
    type: 'education' as const,
    org: 'Saintgits College of Engineering, Kerala',
    role: 'B.Tech (Honours) Computer Science and Engineering',
    period: '2018 – 2022',
    detail: 'CGPA 8.43',
    bullets: [],
  },
  {
    type: 'work' as const,
    org: 'Ernst & Young GDS',
    location: 'Kochi',
    role: 'Associate Software Engineer',
    period: 'Aug 2022 – Jun 2023',
    bullets: [
      'Conducted black-box, grey-box and authenticated pentests across 20+ client applications with 50+ findings.',
      'Performed OWASP Top 10 assessments with detailed remediation recommendations.',
      'Carried out threat research and analysis to support client engagements.',
    ],
  },
  {
    type: 'work' as const,
    org: 'Tata Consultancy Services',
    location: 'Bhubaneswar',
    role: 'Cybersecurity Analyst',
    period: 'Jun 2023 – Present',
    bullets: [
      'Performed manual pentests on 50+ web applications using Burp Suite and OWASP Top 10 methodology.',
      'Conducted onsite security assessment of an Electronic Flight Bag (EFB) iPad, validating iPadOS hardening before production deployment.',
      'Documented 70+ vulnerabilities with reproduction steps, risk assessment and remediation guidance.',
      'Ran assessments with industry-standard DAST and network scanning tooling; tuning reduced false positives by 30%.',
      'Performed thick client testing covering insecure storage, authentication flaws and sensitive data exposure.',
      'Led LLM application pentesting (prompt injection, sensitive data leakage) across 10+ assessments.',
      'Conducted authenticated and unauthenticated network assessments across 150+ hosts.',
      'Built Python automation improving detection and analysis of 30+ complex threats.',
    ],
  },
]

export const certifications = [
  {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    year: '2026',
    inProgress: false,
  },
  {
    name: 'eJPT',
    issuer: 'INE Security',
    year: '2025',
    inProgress: false,
  },
  {
    name: 'Ethical Hacking Associate',
    issuer: 'EC-Council',
    year: '2022',
    inProgress: false,
  },
  {
    name: 'CRTP',
    issuer: 'Altered Security',
    year: 'Target Jan 2027',
    inProgress: true,
  },
]

export const achievements = [
  {
    title: 'HackQuest CTF Core Team',
    description:
      'Core team member for HackQuest, a national-level CTF by TCS. Introduced dynamic flagging, reducing flag leakage by 80%.',
  },
  {
    title: 'Client Recognition — EFB Assessment',
    description:
      'Received client appreciation for the onsite Electronic Flight Bag security assessment.',
  },
  {
    title: 'Star of the Year',
    description: 'Received the Star of the Year award twice.',
  },
]

export const skills = {
  core: [
    'Web App Pentesting',
    'API Security',
    'Mobile Security',
    'Thick Client',
    'Network Security',
    'Cloud Security',
    'VAPT',
    'DAST',
  ],
  frameworks: [
    'OWASP Top 10',
    'OWASP API Top 10',
    'OWASP Mobile Top 10',
    'OWASP Top 10 for LLM Apps',
    'CVSS v3.1',
    'MITRE ATT&CK',
  ],
  tools: [
    'Burp Suite',
    'Nmap',
    'Metasploit',
    'Gobuster',
    'Wireshark',
    'InsightAppSec',
    'Tenable.io',
    'Hydra',
    'SQLMap',
  ],
  technical: ['Kali Linux', 'Postman', 'Python', 'REST APIs', 'JSON'],
}

export const services = [
  {
    title: 'Web & API Security',
    description: 'OWASP Top 10 and API Top 10 assessments, manual and automated.',
    icon: 'Globe',
    chips: [],
  },
  {
    title: 'Mobile Security',
    description: 'Mobile app and device security testing against the OWASP Mobile Top 10, including onsite device hardening reviews.',
    icon: 'Smartphone',
    chips: [],
  },
  {
    title: 'Thick Client Testing',
    description: 'Insecure storage, authentication flaws and sensitive data exposure in desktop apps.',
    icon: 'Monitor',
    chips: [],
  },
  {
    title: 'Network Security',
    description: 'Authenticated and unauthenticated assessments across hosts.',
    icon: 'Network',
    chips: [],
  },
  {
    title: 'AI/LLM Security',
    description: 'Testing LLM-based applications for prompt injection and sensitive data leakage, guided by the OWASP Top 10 for LLM Applications.',
    icon: 'Brain',
    chips: ['Prompt injection', 'Data leakage', 'OWASP LLM Top 10'],
  },
  {
    title: 'Cloud Security',
    description: 'Cloud security testing and vulnerability assessment.',
    icon: 'Cloud',
    chips: [],
  },
  {
    title: 'Security Automation',
    description: 'Python tooling to improve detection and analysis efficiency.',
    icon: 'Code2',
    chips: [],
  },
]

export const featuredProject = {
  title: 'Onsite iPad Security Assessment',
  subtitle: 'Electronic Flight Bag (EFB)',
  description:
    'Onsite assessment validating iPadOS hardening and security controls before production deployment, with client recognition.',
  chips: ['MDM Configuration', 'OS Hardening', 'App Security', 'Data Protection'],
}

export const projects = [
  {
    title: 'Web Application Security',
    description:
      'Manual and automated assessments following OWASP Top 10 methodology across diverse web application architectures.',
    tags: ['OWASP Top 10', 'Burp Suite', 'DAST'],
  },
  {
    title: 'API Security',
    description:
      'REST API assessments covering authentication, authorisation, injection and business logic flaws per OWASP API Top 10.',
    tags: ['OWASP API Top 10', 'Postman', 'Burp Suite'],
  },
  {
    title: 'Mobile Security',
    description:
      'iOS and Android application testing covering data storage, network communication and authentication per OWASP Mobile Top 10.',
    tags: ['OWASP Mobile Top 10', 'iOS', 'Android'],
  },
  {
    title: 'Thick Client Security',
    description:
      'Desktop application assessments targeting insecure storage, authentication flaws and sensitive data exposure.',
    tags: ['Thick Client', 'Binary Analysis', 'Network Traffic'],
  },
]

export const education = {
  degree: 'B.Tech (Honours) Computer Science and Engineering',
  institution: 'Saintgits College of Engineering, Kerala',
  period: '2018 – 2022',
  cgpa: '8.43',
}

export const footer = {
  built: 'Built with React + Vite + TypeScript',
  copyright: `© ${new Date().getFullYear()} Jeffrey Jolly. All rights reserved.`,
}
