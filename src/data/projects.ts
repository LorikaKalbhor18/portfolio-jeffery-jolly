// src/data/projects.ts
// Methodology-level content only. No client names, findings, versions or counts.
// Client details intentionally generic.

export type Phase = {
  title: string
  summary: string
  steps: string[]
}

export type ToolUse = {
  name: string
  use: string
}

export type Project = {
  slug: string
  title: string
  icon: 'globe' | 'api' | 'smartphone' | 'monitor' | 'cloud' | 'brain'
  description: string
  tags: string[]
  standard: string
  overview: string
  phases: Phase[]
  tools: ToolUse[]
  deliverables: string[]
}

export const commonDeliverables = [
  'A clear report with a CVSS v3.1 severity rating for every finding',
  'Step-by-step reproduction notes and supporting evidence',
  'Practical remediation guidance the team can act on',
  'A retest after fixes to confirm each issue is closed',
]

export const projects: Project[] = [
  {
    slug: 'web-application-security',
    title: 'Web Application Security',
    icon: 'globe',
    description:
      'Manual and automated assessments following OWASP Top 10 methodology across diverse web application architectures.',
    tags: ['OWASP Top 10', 'Burp Suite', 'DAST'],
    standard: 'OWASP Top 10',
    overview:
      'A structured approach to testing web applications against the OWASP Top 10, combining automated scanning with manual testing. Engagements can be black-box, grey-box or authenticated, depending on what the team wants to learn.',
    phases: [
      {
        title: 'Scope and planning',
        summary: 'Agree what is in scope and how testing will run.',
        steps: [
          'Confirm target URLs, environments and testing windows',
          'Agree test accounts and user roles for authenticated testing',
          'Define out-of-scope areas and how issues will be escalated',
        ],
      },
      {
        title: 'Mapping the application',
        summary: 'Understand how the application works before testing it.',
        steps: [
          'Walk through every feature and record entry points, roles and data flows',
          'Identify the technology stack and exposed components',
          'Run content discovery to find hidden paths and files',
        ],
      },
      {
        title: 'Automated scanning',
        summary: 'Cover breadth quickly, then tune the results.',
        steps: [
          'Run dynamic scans with a configured scan profile',
          'Tune scan settings to reduce false positives',
          'Use the results to guide manual testing',
        ],
      },
      {
        title: 'Manual testing',
        summary: 'Test the areas scanners miss, mapped to the OWASP Top 10.',
        steps: [
          'Access control and authorisation checks across roles',
          'Authentication, session handling and password reset flows',
          'Injection and input validation, including SQL injection',
          'Security misconfiguration and sensitive data exposure',
          'Business logic flaws specific to the application',
        ],
      },
      {
        title: 'Validation',
        summary: 'Confirm every finding is real before it is reported.',
        steps: [
          'Reproduce each issue and confirm it can be exploited',
          'Assess realistic impact and rule out false positives',
          'Capture clear evidence for each confirmed finding',
        ],
      },
      {
        title: 'Reporting and retest',
        summary: 'Turn findings into fixes.',
        steps: [
          'Rate each finding using CVSS v3.1',
          'Write reproduction steps and remediation guidance',
          'Support the team during fixes, then retest to confirm closure',
        ],
      },
    ],
    tools: [
      { name: 'Burp Suite', use: 'Intercepting proxy for manual testing' },
      { name: 'InsightAppSec', use: 'Dynamic application scanning' },
      { name: 'Gobuster', use: 'Content and directory discovery' },
      { name: 'SQLMap', use: 'Confirming SQL injection issues' },
      { name: 'Nmap', use: 'Service discovery on the hosting environment' },
      { name: 'Hydra', use: 'Credential testing where it is in scope' },
      { name: 'Python', use: 'Scripts to automate repetitive analysis' },
    ],
    deliverables: commonDeliverables,
  },
  {
    slug: 'api-security',
    title: 'API Security',
    icon: 'api',
    description:
      'REST API assessments covering authentication, authorisation, injection and business logic flaws per OWASP API Top 10.',
    tags: ['OWASP API Top 10', 'Postman', 'Burp Suite'],
    standard: 'OWASP API Security Top 10',
    overview:
      'Testing of REST APIs against the OWASP API Security Top 10, focused on who can access what, how input is handled, and how the API behaves when it is misused.',
    phases: [
      {
        title: 'Scope and documentation',
        summary: 'Gather what is needed to test the API properly.',
        steps: [
          'Collect API specifications, collections and example requests',
          'Agree test accounts, roles and environments',
          'Confirm rate limits and testing windows',
        ],
      },
      {
        title: 'Endpoint inventory',
        summary: 'Build a complete picture of the API surface.',
        steps: [
          'List endpoints, methods, parameters and required authentication',
          'Map which roles should reach which functions',
          'Look for undocumented or legacy endpoints',
        ],
      },
      {
        title: 'Authentication and authorisation',
        summary: 'Check that access is enforced on every request.',
        steps: [
          'Review token handling, expiry and session behaviour',
          'Test object-level access by swapping identifiers between users',
          'Test function-level access across roles',
        ],
      },
      {
        title: 'Input handling',
        summary: 'See how the API reacts to unexpected input.',
        steps: [
          'Test injection and input validation on parameters and request bodies',
          'Check how the API handles unexpected types, sizes and formats',
          'Review error messages for information leakage',
        ],
      },
      {
        title: 'Business logic and abuse',
        summary: 'Test how the API behaves under misuse.',
        steps: [
          'Test rate limiting and resource consumption',
          'Try out-of-order and repeated requests',
          'Check for excessive data in responses',
        ],
      },
      {
        title: 'Validation and reporting',
        summary: 'Confirm findings and document them clearly.',
        steps: [
          'Reproduce each issue and capture evidence',
          'Rate findings using CVSS v3.1 and write remediation guidance',
          'Retest after fixes to confirm closure',
        ],
      },
    ],
    tools: [
      { name: 'Postman', use: 'Building and replaying API requests' },
      { name: 'Burp Suite', use: 'Intercepting and modifying API traffic' },
      { name: 'Python', use: 'Scripting repeated tests across roles' },
    ],
    deliverables: commonDeliverables,
  },
  {
    slug: 'mobile-security',
    title: 'Mobile Security',
    icon: 'smartphone',
    description:
      'Mobile application and device testing covering data storage, network communication, authentication and device hardening per OWASP Mobile Top 10.',
    tags: ['OWASP Mobile Top 10', 'Burp Suite', 'Wireshark'],
    standard: 'OWASP Mobile Top 10',
    overview:
      'Security testing of mobile applications and devices, guided by the OWASP Mobile Top 10. This includes onsite device assessments that validate hardening and security controls before production.',
    phases: [
      {
        title: 'Scope and setup',
        summary: 'Decide what is being tested and prepare the environment.',
        steps: [
          'Confirm app builds, OS versions, devices and test accounts',
          'Agree whether testing covers the app, the device configuration, or both',
          'Prepare a test environment and traffic interception',
        ],
      },
      {
        title: 'Application review',
        summary: 'Understand what the app contains and what it connects to.',
        steps: [
          'Review app permissions, configuration and packaged files',
          'Look for hardcoded secrets and sensitive data in the package',
          'Map screens, features and the backend services the app uses',
        ],
      },
      {
        title: 'Data storage',
        summary: 'Check what is kept on the device.',
        steps: [
          'Check what the app stores on the device and how',
          'Look for sensitive data in local files, caches and logs',
          'Check behaviour after logout and when the app moves to the background',
        ],
      },
      {
        title: 'Network communication',
        summary: 'Examine how data moves between the app and its backend.',
        steps: [
          'Intercept traffic between the app and its backend',
          'Check transport security and certificate validation',
          'Review the backend APIs the app depends on',
        ],
      },
      {
        title: 'Authentication and device hardening',
        summary: 'Test sign-in and confirm required controls are enforced.',
        steps: [
          'Test login, session handling and biometric or passcode flows',
          'Review device configuration against the agreed hardening baseline',
          'Validate that required security controls are enforced',
        ],
      },
      {
        title: 'Validation and reporting',
        summary: 'Confirm findings and document them clearly.',
        steps: [
          'Reproduce each issue and capture evidence',
          'Rate findings using CVSS v3.1 and write remediation guidance',
          'Retest after fixes to confirm closure',
        ],
      },
    ],
    tools: [
      { name: 'Burp Suite', use: 'Intercepting app traffic' },
      { name: 'Wireshark', use: 'Traffic analysis' },
      { name: 'Postman', use: 'Testing the backend APIs' },
    ],
    deliverables: commonDeliverables,
  },
  {
    slug: 'thick-client-security',
    title: 'Thick Client Security',
    icon: 'monitor',
    description:
      'Desktop application assessments targeting insecure storage, authentication flaws and sensitive data exposure.',
    tags: ['Thick Client', 'Insecure Storage', 'Network Traffic'],
    standard: 'OWASP-aligned thick client testing',
    overview:
      'Assessment of desktop applications that run on the user’s machine and talk to servers, focusing on how they store data, authenticate users and communicate.',
    phases: [
      {
        title: 'Scope and architecture',
        summary: 'Understand how the application is built.',
        steps: [
          'Confirm the application version, installer and test accounts',
          'Identify the architecture: local only, client and server, or multi-tier',
          'List the components, services and data stores involved',
        ],
      },
      {
        title: 'Local storage review',
        summary: 'Look at what the application leaves on the machine.',
        steps: [
          'Inspect files, configuration, caches and logs the application creates',
          'Look for credentials or sensitive data stored in clear text or weakly protected',
          'Check file and folder permissions',
        ],
      },
      {
        title: 'Authentication and session',
        summary: 'Test how users are identified and kept signed in.',
        steps: [
          'Test login flows and how credentials are handled',
          'Check session handling and what happens when sessions expire',
          'Look for flaws that allow bypassing authentication',
        ],
      },
      {
        title: 'Network traffic',
        summary: 'Examine how the client communicates.',
        steps: [
          'Capture and review traffic between the client and the server',
          'Intercept requests where possible and test them like web or API requests',
          'Check whether data is protected in transit',
        ],
      },
      {
        title: 'Server-side checks',
        summary: 'Make sure the server does not trust the client.',
        steps: [
          'Test the backend services the client relies on',
          'Check that the server enforces what the client appears to restrict',
          'Look for sensitive data exposure in responses',
        ],
      },
      {
        title: 'Validation and reporting',
        summary: 'Confirm findings and document them clearly.',
        steps: [
          'Reproduce each issue and capture evidence',
          'Rate findings using CVSS v3.1 and write remediation guidance',
          'Retest after fixes to confirm closure',
        ],
      },
    ],
    tools: [
      { name: 'Burp Suite', use: 'Intercepting client traffic' },
      { name: 'Wireshark', use: 'Capturing and analysing traffic' },
      { name: 'Nmap', use: 'Finding the services the client talks to' },
      { name: 'Postman', use: 'Replaying backend requests' },
    ],
    deliverables: commonDeliverables,
  },
  {
    slug: 'cloud-security',
    title: 'Cloud Security',
    icon: 'cloud',
    description:
      'Cloud security testing covering configuration, access and exposure, with vulnerability assessment of what is reachable.',
    tags: ['Cloud Security', 'Configuration Review', 'Vulnerability Assessment'],
    standard: 'Provider security guidance and common cloud benchmarks',
    overview:
      'Security testing of cloud environments, focused on configuration, access and exposure. The exact approach is agreed per engagement and depends on the provider and the permissions granted.',
    phases: [
      {
        title: 'Scope and access',
        summary: 'Agree what is covered and how access is granted.',
        steps: [
          'Agree which accounts, subscriptions or projects are in scope',
          'Use read-only access where possible for configuration review',
          'Confirm testing windows and rules for any active testing',
        ],
      },
      {
        title: 'Asset inventory',
        summary: 'Know what exists before judging it.',
        steps: [
          'List compute, storage, network and identity resources',
          'Identify internet-facing services',
          'Record what data each resource handles',
        ],
      },
      {
        title: 'Identity and access review',
        summary: 'Check who can do what.',
        steps: [
          'Review roles, permissions and policies for excess access',
          'Check how credentials and secrets are managed',
          'Look for accounts without strong authentication',
        ],
      },
      {
        title: 'Configuration review',
        summary: 'Look for settings that expose data or services.',
        steps: [
          'Check storage and database exposure settings',
          'Review network rules and open ports',
          'Check encryption and logging settings',
        ],
      },
      {
        title: 'Vulnerability assessment',
        summary: 'Find known issues in what is reachable.',
        steps: [
          'Scan exposed hosts and services for known issues',
          'Validate which issues are actually reachable',
          'Prioritise by exposure and impact',
        ],
      },
      {
        title: 'Validation and reporting',
        summary: 'Confirm findings and document them clearly.',
        steps: [
          'Reproduce each issue and capture evidence',
          'Rate findings using CVSS v3.1 and write remediation guidance',
          'Retest after fixes to confirm closure',
        ],
      },
    ],
    tools: [
      { name: 'Tenable.io', use: 'Vulnerability assessment' },
      { name: 'Nmap', use: 'Checking external exposure' },
      { name: 'Burp Suite', use: 'Testing web applications hosted in the cloud' },
      { name: 'Python', use: 'Scripts to automate analysis' },
    ],
    deliverables: commonDeliverables,
  },
  {
    slug: 'ai-llm-security',
    title: 'AI/LLM Security',
    icon: 'brain',
    description:
      'Testing LLM-based applications for prompt injection and sensitive data leakage, guided by the OWASP Top 10 for LLM Applications.',
    tags: ['OWASP LLM Top 10', 'Prompt Injection', 'Data Leakage'],
    standard: 'OWASP Top 10 for LLM Applications',
    overview:
      'Testing of applications built on large language models, guided by the OWASP Top 10 for LLM Applications. The focus is on prompt injection and sensitive data leakage, and on how the application uses the model’s output.',
    phases: [
      {
        title: 'Scope and architecture',
        summary: 'Understand what the model is connected to.',
        steps: [
          'Identify the model, system prompt, connected tools and data sources',
          'Understand who can use the application and what data it can reach',
          'Map the application to the relevant OWASP LLM risks',
        ],
      },
      {
        title: 'Prompt injection',
        summary: 'Test whether the intended instructions can be overridden.',
        steps: [
          'Test direct attempts to override the intended instructions',
          'Test indirect injection through documents, web content or other inputs',
          'Repeat each test several times, because model outputs vary',
        ],
      },
      {
        title: 'Sensitive data leakage',
        summary: 'Check what the application can be made to reveal.',
        steps: [
          'Check whether the application reveals instructions, internal data or other users’ information',
          'Test what happens when the model is asked about data it should not share',
          'Review what the application logs and stores',
        ],
      },
      {
        title: 'Output handling and tool use',
        summary: 'Look at what happens after the model responds.',
        steps: [
          'Check how the application treats model output before using it',
          'Review any actions the model can trigger and the permissions they carry',
          'Test whether outputs can be turned into attacks on other components',
        ],
      },
      {
        title: 'Validation',
        summary: 'Make sure findings hold up.',
        steps: [
          'Confirm each finding can be reproduced reliably',
          'Describe the conditions that make it work',
          'Capture clear evidence',
        ],
      },
      {
        title: 'Reporting and retest',
        summary: 'Turn findings into layered fixes.',
        steps: [
          'Rate impact in terms of data exposure and misuse',
          'Recommend layered controls such as input and output checks, least privilege and monitoring',
          'Retest after changes',
        ],
      },
    ],
    tools: [
      { name: 'Burp Suite', use: 'Intercepting and modifying requests to the application' },
      { name: 'Postman', use: 'Replaying and varying requests' },
      { name: 'Python', use: 'Scripts that run prompt tests repeatedly' },
      { name: 'LLM-assisted tooling', use: 'Generating payload ideas and triaging results' },
    ],
    deliverables: commonDeliverables,
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
