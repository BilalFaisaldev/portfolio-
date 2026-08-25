const db = require('./database');

function seedDatabase() {
  console.log('Seeding SQLite database with initial portfolio data...');

  // 1. Seed Personal Info if not exists
  const existingPersonal = db.prepare('SELECT id FROM personal_info WHERE id = 1').get();
  if (!existingPersonal) {
    const personalData = {
      name: "Bilal Faisal",
      role_badge: "Senior Full Stack & Cloud Engineer",
      headline_start: "Engineering",
      headline_gradient: "Scalable Web Platforms",
      headline_end: "& High-Performance Cloud Architectures.",
      subheadline: "I bridge complex business logic with clean, scalable code. Specializing in high-concurrency Node.js/TypeScript backends, modern Next.js frontends, and cloud-native systems.",
      avatar_text: "BF",
      status_badge: "Available for Q2/Q3 Projects & Contracts",
      github_url: "https://github.com/",
      linkedin_url: "https://linkedin.com/",
      email: "contact@bilalfaisal.dev",
      phone: "+92 300 1234567",
      calendly_url: "https://calendly.com/",
      location: "Islamabad, PK (Remote Worldwide)",
      hero_stats: JSON.stringify([
        { label: "Shipped Apps", value: "20+" },
        { label: "Uptime Reliability", value: "99.9%" },
        { label: "Client Satisfaction", value: "100%" }
      ]),
      about_data: JSON.stringify({
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
      })
    };

    db.prepare(`
      INSERT INTO personal_info (
        id, name, role_badge, headline_start, headline_gradient, headline_end,
        subheadline, avatar_text, status_badge, github_url, linkedin_url,
        email, phone, calendly_url, location, hero_stats, about_data
      ) VALUES (
        1, @name, @role_badge, @headline_start, @headline_gradient, @headline_end,
        @subheadline, @avatar_text, @status_badge, @github_url, @linkedin_url,
        @email, @phone, @calendly_url, @location, @hero_stats, @about_data
      )
    `).run(personalData);
    console.log('✔ Personal info seeded.');
  }

  // 2. Seed Projects if table is empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, type, title, subtitle, short_description, full_description, tags, live_url, github_url, featured
      ) VALUES (
        @id, @type, @title, @subtitle, @short_description, @full_description, @tags, @live_url, @github_url, @featured
      )
    `);

    const projects = [
      {
        id: "grabyourguide",
        type: "client",
        title: "GrabYourGuide",
        subtitle: "Tour & Experience Booking Marketplace",
        short_description: "Developed a full-featured marketplace platform for tours, enabling suppliers to onboard, list tours, manage bookings, and set dynamic pricing with Stripe payment gateways.",
        full_description: `Developed a comprehensive marketplace platform connecting travelers with verified tour guides and local experiences worldwide.\n\nKey Technical Accomplishments:\n• Multi-vendor onboarding and verification pipeline with custom supplier dashboards.\n• Dynamic availability calendaring and instant real-time booking reservation locks.\n• Split payment processing and commission management via Stripe Connect.\n• Role-based administrative portal with revenue analytics and chargeback management.`,
        tags: JSON.stringify(["Node.js", "Express.js", "PostgreSQL", "Stripe Connect", "Redis", "React"]),
        live_url: "https://example.com/grabyourguide",
        github_url: "",
        featured: 1
      },
      {
        id: "pastapapers",
        type: "client",
        title: "PastaPapers",
        subtitle: "AI-Powered Exam Preparation & Tutoring Platform",
        short_description: "Engineered an AI-assisted examination prep system that processes structured exam questions, performs automatic grading, and provides instant interactive AI tutoring feedback.",
        full_description: `Designed and built an intelligent examination study platform that converts thousands of PDF exam papers into structured interactive modules.\n\nKey Technical Accomplishments:\n• Automated question parsing and indexing pipeline for multiple educational boards.\n• Interactive AI assessment engine with token-gated tutoring assistance for students.\n• Subscription and paywall integration with Lemon Squeezy and server-side webhook enforcement.\n• Comprehensive student diagnostics identifying topic-level knowledge gaps and score trends.`,
        tags: JSON.stringify(["Next.js", "TypeScript", "Python", "OpenAI API", "Lemon Squeezy", "Cloudflare"]),
        live_url: "https://example.com/pastapapers",
        github_url: "",
        featured: 1
      },
      {
        id: "codecrate",
        type: "personal",
        title: "CodeCrate",
        subtitle: "Minimalist Developer Snippet & Secret Manager",
        short_description: "A developer-first snippet organizer featuring encrypted storage, instant fuzzy search, syntax highlighting for 50+ languages, and rapid keyboard navigation.",
        full_description: `Built as a fast, keyboard-centric snippet manager for developers who value speed, privacy, and zero bloat.\n\nKey Technical Accomplishments:\n• Client-side encryption for sensitive config files and API keys before cloud backup.\n• Sub-millisecond fuzzy search with tag filtering and keyboard shortcuts.\n• Beautiful dark/light syntax themes and instant clipboard copy actions.\n• Offline-first support with IndexedDB local caching.`,
        tags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite"]),
        live_url: "https://example.com/codecrate",
        github_url: "https://github.com/example/codecrate",
        featured: 1
      },
      {
        id: "tlyne",
        type: "personal",
        title: "Tlyne",
        subtitle: "Collaborative Agile Project Management Suite",
        short_description: "Designed and developed a real-time project management web application with interactive kanban boards, sprint planners, and automated test coverage with Playwright.",
        full_description: `A full-stack collaborative workspace tool designed to simplify sprint planning and team task tracking.\n\nKey Technical Accomplishments:\n• Real-time drag-and-drop Kanban boards with optimistic UI updates.\n• Relational database schema with complex workspace permissions built on Prisma & PostgreSQL.\n• Comprehensive end-to-end test suite using Playwright covering core critical user journeys.\n• Fast keyboard navigation, markdown task notes, and timeline forecasting.`,
        tags: JSON.stringify(["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Playwright", "WebSockets"]),
        live_url: "https://example.com/tlyne",
        github_url: "https://github.com/example/tlyne",
        featured: 1
      }
    ];

    const insertManyProjects = db.transaction((list) => {
      for (const proj of list) insertProject.run(proj);
    });
    insertManyProjects(projects);
    console.log('✔ Projects seeded.');
  }

  // 3. Seed Services if empty
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (serviceCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (title, description, bullets, icon)
      VALUES (@title, @description, @bullets, @icon)
    `);

    const services = [
      {
        title: "Full-Stack Web Applications",
        description: "End-to-end web applications engineered from scratch. From interactive responsive frontends to scalable cloud databases and payment systems.",
        bullets: JSON.stringify(["Custom SaaS & multi-tenant platforms", "Interactive booking & marketplace engines", "Real-time collaboration dashboards", "High-performance SPAs with Next.js"]),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>`
      },
      {
        title: "API & Microservice Architectures",
        description: "High-throughput REST and GraphQL APIs with robust security, database indexing, rate limiting, and zero-downtime scalability.",
        bullets: JSON.stringify(["Microservice design & implementation", "Stripe & LemonSqueezy payment integrations", "OAuth2, JWT & RBAC access control", "Redis caching & sub-50ms API latency"]),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`
      },
      {
        title: "Performance & AI Integrations",
        description: "Upgrading existing software systems with LLM integration, automated agent workflows, code refactoring, and Core Web Vitals optimization.",
        bullets: JSON.stringify(["OpenAI & Gemini API agent workflows", "Playwright & Vitest automated testing suites", "CWV (LCP/INP) performance audits", "Legacy codebase modernizations"]),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path></svg>`
      }
    ];

    const insertManyServices = db.transaction((list) => {
      for (const s of list) insertService.run(s);
    });
    insertManyServices(services);
    console.log('✔ Services seeded.');
  }

  // 4. Seed Process Steps if empty
  const processCount = db.prepare('SELECT COUNT(*) as count FROM process_steps').get().count;
  if (processCount === 0) {
    const insertStep = db.prepare(`
      INSERT INTO process_steps (step, title, description)
      VALUES (@step, @title, @description)
    `);

    const steps = [
      { step: "01", title: "Technical Discovery", description: "Deep dive into business goals, functional requirements, API contracts, and database relationship diagrams." },
      { step: "02", title: "System Architecture", description: "Drafting schema designs, selecting optimal frameworks, designing security boundaries, and setting up staging environments." },
      { step: "03", title: "Sprint Execution", description: "Iterative test-driven development with weekly demos, clean git commits, and regular stakeholder communication." },
      { step: "04", title: "Production Launch", description: "Zero-downtime deployment, CDN edge caching, structured logging, performance monitoring, and complete documentation." }
    ];

    const insertManySteps = db.transaction((list) => {
      for (const s of list) insertStep.run(s);
    });
    insertManySteps(steps);
    console.log('✔ Process steps seeded.');
  }

  // 5. Seed Testimonials if empty
  const testimonialCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count;
  if (testimonialCount === 0) {
    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (name, role, quote, full_quote, rating)
      VALUES (@name, @role, @quote, @full_quote, @rating)
    `);

    const testimonials = [
      {
        name: "Ibrahim Hussain",
        role: "CEO, PastaPapers",
        quote: "Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. The speed and quality of delivery exceeded all our expectations.",
        full_quote: "Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. He was quick with fixes, proactive in communication, and delivered unbelievable speed while maintaining clean code. I'm genuinely thrilled with the results and would work with him again on any future project.",
        rating: 5
      },
      {
        name: "Omar Amjad",
        role: "Product Founder",
        quote: "What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn't a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards.",
        full_quote: "What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn't a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards. He didn't just code what was requested; he thought ahead and gave architectural suggestions that made the product substantially better.",
        rating: 5
      },
      {
        name: "Abdullah Fahad",
        role: "Founder, Novu Labs",
        quote: "The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. 100% satisfied.",
        full_quote: "The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. Any revision was handled with utmost professionalism. I feel completely confident recommending him.",
        rating: 5
      }
    ];

    const insertManyTestimonials = db.transaction((list) => {
      for (const t of list) insertTestimonial.run(t);
    });
    insertManyTestimonials(testimonials);
    console.log('✔ Testimonials seeded.');
  }

  console.log('✔ Database seeding complete!');
}

seedDatabase();
module.exports = seedDatabase;
