/**
 * Minimalist Developer Portfolio - Signature Aurora Tech Configuration
 * Fully customizable data model for personal info, IDE snippets, Bento stats, projects, and services.
 */

const portfolioConfig = {
  personal: {
    name: "Bilal Faisal",
    roleBadge: "Senior Full Stack & Cloud Engineer",
    headlineStart: "Engineering",
    headlineGradient: "Scalable Web Platforms",
    headlineEnd: "& High-Performance Cloud Architectures.",
    subheadline: "I bridge complex business logic with clean, scalable code. Specializing in high-concurrency Node.js/TypeScript backends, modern Next.js frontends, and cloud-native systems.",
    avatarText: "BF",
    statusBadge: "Available for Q2/Q3 Projects & Contracts",
    githubUrl: "https://github.com/",
    linkedinUrl: "https://linkedin.com/",
    email: "contact@bilalfaisal.dev",
    phone: "+92 300 1234567",
    calendlyUrl: "https://calendly.com/",
    location: "Islamabad, PK (Remote Worldwide)",
    
    // Hero Stats
    heroStats: [
      { label: "Shipped Apps", value: "20+" },
      { label: "Uptime Reliability", value: "99.9%" },
      { label: "Client Satisfaction", value: "100%" }
    ],

    // About Section Bento Details
    about: {
      tag: "ENGINEERING PHILOSOPHY",
      title: "Building Resilient Systems That Scale Under Pressure",
      bioText: "With over 5 years of engineering experience across the entire development lifecycle, I specialize in crafting full-stack web applications that combine snappy user interfaces with ultra-reliable, high-throughput backends. I prioritize clean domain-driven architecture, robust type safety, automated end-to-end testing, and automated CI/CD pipelines.",
      experienceYears: "5+",
      endpointsDeployed: "150+",
      happyClients: "18+",
      corePillars: [
        { title: "Type-Safe & Clean Code", desc: "Strict TypeScript, functional patterns, and modular domain architecture." },
        { title: "Resilient Cloud Backends", desc: "Microservices, distributed caching with Redis, and optimized database indexing." },
        { title: "Automated QA & CI/CD", desc: "Comprehensive unit and E2E testing using Jest, Vitest, and Playwright." }
      ],
      techRadarNow: ["Next.js 15 App Router", "AI Agents & LLM Tooling", "Serverless PostgreSQL", "Distributed WebSockets"]
    }
  },

  // Interactive Hero IDE Snippets
  ideTabs: {
    developer: `// developer.ts
interface Engineer {
  name: string;
  role: string;
  coreStack: string[];
  status: "available" | "building";
}

export const bilal: Engineer = {
  name: "Bilal Faisal",
  role: "Full Stack Engineer",
  coreStack: [
    "TypeScript", "Next.js", 
    "Node.js", "PostgreSQL", 
    "Prisma", "Docker", "AWS"
  ],
  status: "available"
};

export async function buildSolution(requirements: Spec): Promise<Product> {
  const architecture = await designScalableSchema(requirements);
  const backend = await implementResilientAPIs(architecture);
  const frontend = await craftResponsiveUI(backend);
  return deployToProduction({ zeroDowntime: true });
}`,

    stack: `{
  "engineer": "Bilal Faisal",
  "technologies": {
    "frontend": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    "backend": ["Node.js", "Express", "NestJS", "Fastify", "REST & GraphQL"],
    "databases": ["PostgreSQL", "Prisma ORM", "MongoDB", "Redis"],
    "devops": ["Docker", "Linux", "CI/CD Actions", "AWS", "Cloudflare"]
  },
  "metrics": {
    "averageApiLatency": "< 45ms",
    "testCoverage": "> 90%"
  }
}`,

    terminal: `➜  bilal-portfolio git:(main) yarn test:e2e
✔ Running Playwright Test Suite...
  ✔ auth.spec.ts: user login and JWT verification (142ms)
  ✔ payment.spec.ts: stripe webhook checkout lock (210ms)
  ✔ api.spec.ts: database transaction concurrency (85ms)

3 passed (437ms) - 100% test coverage achieved.
🚀 Production deployment ready at bilalfaisal.dev`
  },

  techStack: [
    {
      category: "Frontend Development",
      description: "Next.js 15, React, TypeScript, Modern CSS/Tailwind, WebSockets",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`
    },
    {
      category: "Backend & APIs",
      description: "Node.js, Express, NestJS, RESTful & GraphQL APIs, Auth0/JWT",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`
    },
    {
      category: "Database & Caching",
      description: "PostgreSQL, Prisma ORM, MongoDB, Redis, Supabase, MySQL",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>`
    },
    {
      category: "DevOps & Cloud",
      description: "Docker, GitHub Actions CI/CD, AWS (S3, EC2, Lambda), Linux, Cloudflare",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>`
    }
  ],

  services: [
    {
      title: "Full-Stack Web Applications",
      description: "End-to-end web applications engineered from scratch. From interactive responsive frontends to scalable cloud databases and payment systems.",
      bullets: ["Custom SaaS & multi-tenant platforms", "Interactive booking & marketplace engines", "Real-time collaboration dashboards", "High-performance SPAs with Next.js"],
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>`
    },
    {
      title: "API & Microservice Architectures",
      description: "High-throughput REST and GraphQL APIs with robust security, database indexing, rate limiting, and zero-downtime scalability.",
      bullets: ["Microservice design & implementation", "Stripe & LemonSqueezy payment integrations", "OAuth2, JWT & RBAC access control", "Redis caching & sub-50ms API latency"],
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`
    },
    {
      title: "Performance & AI Integrations",
      description: "Upgrading existing software systems with LLM integration, automated agent workflows, code refactoring, and Core Web Vitals optimization.",
      bullets: ["OpenAI & Gemini API agent workflows", "Playwright & Vitest automated testing suites", "CWV (LCP/INP) performance audits", "Legacy codebase modernizations"],
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path></svg>`
    }
  ],

  process: [
    {
      step: "01",
      title: "Technical Discovery",
      description: "Deep dive into business goals, functional requirements, API contracts, and database relationship diagrams."
    },
    {
      step: "02",
      title: "System Architecture",
      description: "Drafting schema designs, selecting optimal frameworks, designing security boundaries, and setting up staging environments."
    },
    {
      step: "03",
      title: "Sprint Execution",
      description: "Iterative test-driven development with weekly demos, clean git commits, and regular stakeholder communication."
    },
    {
      step: "04",
      title: "Production Launch",
      description: "Zero-downtime deployment, CDN edge caching, structured logging, performance monitoring, and complete documentation."
    }
  ],

  projects: [
    {
      id: "grabyourguide",
      type: "client",
      title: "GrabYourGuide",
      subtitle: "Tour & Experience Booking Marketplace",
      shortDescription: "Developed a full-featured marketplace platform for tours, enabling suppliers to onboard, list tours, manage bookings, and set dynamic pricing with Stripe payment gateways.",
      fullDescription: `Developed a comprehensive marketplace platform connecting travelers with verified tour guides and local experiences worldwide.
      
Key Technical Accomplishments:
• Multi-vendor onboarding and verification pipeline with custom supplier dashboards.
• Dynamic availability calendaring and instant real-time booking reservation locks.
• Split payment processing and commission management via Stripe Connect.
• Role-based administrative portal with revenue analytics and chargeback management.`,
      tags: ["Node.js", "Express.js", "PostgreSQL", "Stripe Connect", "Redis", "React"],
      liveUrl: "https://example.com/grabyourguide",
      githubUrl: "",
      featured: true
    },
    {
      id: "pastapapers",
      type: "client",
      title: "PastaPapers",
      subtitle: "AI-Powered Exam Preparation & Tutoring Platform",
      shortDescription: "Engineered an AI-assisted examination prep system that processes structured exam questions, performs automatic grading, and provides instant interactive AI tutoring feedback.",
      fullDescription: `Designed and built an intelligent examination study platform that converts thousands of PDF exam papers into structured interactive modules.

Key Technical Accomplishments:
• Automated question parsing and indexing pipeline for multiple educational boards.
• Interactive AI assessment engine with token-gated tutoring assistance for students.
• Subscription and paywall integration with Lemon Squeezy and server-side webhook enforcement.
• Comprehensive student diagnostics identifying topic-level knowledge gaps and score trends.`,
      tags: ["Next.js", "TypeScript", "Python", "OpenAI API", "Lemon Squeezy", "Cloudflare"],
      liveUrl: "https://example.com/pastapapers",
      githubUrl: "",
      featured: true
    },
    {
      id: "codecrate",
      type: "personal",
      title: "CodeCrate",
      subtitle: "Minimalist Developer Snippet & Secret Manager",
      shortDescription: "A developer-first snippet organizer featuring encrypted storage, instant fuzzy search, syntax highlighting for 50+ languages, and rapid keyboard navigation.",
      fullDescription: `Built as a fast, keyboard-centric snippet manager for developers who value speed, privacy, and zero bloat.

Key Technical Accomplishments:
• Client-side encryption for sensitive config files and API keys before cloud backup.
• Sub-millisecond fuzzy search with tag filtering and keyboard shortcuts.
• Beautiful dark/light syntax themes and instant clipboard copy actions.
• Offline-first support with IndexedDB local caching.`,
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite"],
      liveUrl: "https://example.com/codecrate",
      githubUrl: "https://github.com/example/codecrate",
      featured: true
    },
    {
      id: "tlyne",
      type: "personal",
      title: "Tlyne",
      subtitle: "Collaborative Agile Project Management Suite",
      shortDescription: "Designed and developed a real-time project management web application with interactive kanban boards, sprint planners, and automated test coverage with Playwright.",
      fullDescription: `A full-stack collaborative workspace tool designed to simplify sprint planning and team task tracking.

Key Technical Accomplishments:
• Real-time drag-and-drop Kanban boards with optimistic UI updates.
• Relational database schema with complex workspace permissions built on Prisma & PostgreSQL.
• Comprehensive end-to-end test suite using Playwright covering core critical user journeys.
• Fast keyboard navigation, markdown task notes, and timeline forecasting.`,
      tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Playwright", "WebSockets"],
      liveUrl: "https://example.com/tlyne",
      githubUrl: "https://github.com/example/tlyne",
      featured: true
    }
  ],

  testimonials: [
    {
      name: "Ibrahim Hussain",
      role: "CEO, PastaPapers",
      quote: "Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. The speed and quality of delivery exceeded all our expectations.",
      fullQuote: "Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. He was quick with fixes, proactive in communication, and delivered unbelievable speed while maintaining clean code. I'm genuinely thrilled with the results and would work with him again on any future project.",
      rating: 5
    },
    {
      name: "Omar Amjad",
      role: "Product Founder",
      quote: "What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn't a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards.",
      fullQuote: "What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn't a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards. He didn't just code what was requested; he thought ahead and gave architectural suggestions that made the product substantially better.",
      rating: 5
    },
    {
      name: "Abdullah Fahad",
      role: "Founder, Novu Labs",
      quote: "The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. 100% satisfied.",
      fullQuote: "The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. Any revision was handled with utmost professionalism. I feel completely confident recommending him.",
      rating: 5
    }
  ]
};
