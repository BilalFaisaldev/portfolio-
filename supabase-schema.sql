-- ==========================================================================
-- SUPABASE CLOUD DATABASE SCHEMA & SEED DATA FOR BILAL FAISAL PORTFOLIO
-- Paste this entire SQL into your Supabase SQL Editor and click "RUN"
-- ==========================================================================

-- 1. Personal Info Table
CREATE TABLE IF NOT EXISTS personal_info (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  role_badge TEXT,
  headline_start TEXT,
  headline_gradient TEXT,
  headline_end TEXT,
  subheadline TEXT,
  avatar_text TEXT,
  status_badge TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  phone TEXT,
  calendly_url TEXT,
  location TEXT,
  hero_stats JSONB,
  about_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,          -- 'client' or 'personal'
  title TEXT NOT NULL,
  subtitle TEXT,
  short_description TEXT,
  full_description TEXT,
  tags JSONB,                  -- JSON array of strings
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  bullets JSONB,               -- JSON array of strings
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Process Steps Table
CREATE TABLE IF NOT EXISTS process_steps (
  id BIGSERIAL PRIMARY KEY,
  step TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  full_quote TEXT,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Messages / Inquiries Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio contents
DROP POLICY IF EXISTS "Public can read personal_info" ON personal_info;
CREATE POLICY "Public can read personal_info" ON personal_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read projects" ON projects;
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read services" ON services;
CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read process_steps" ON process_steps;
CREATE POLICY "Public can read process_steps" ON process_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read testimonials" ON testimonials;
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);

-- Allow public insert into messages (for contact form)
DROP POLICY IF EXISTS "Public can submit messages" ON messages;
CREATE POLICY "Public can submit messages" ON messages FOR INSERT WITH CHECK (true);

-- Allow full access to all tables using anon key
DROP POLICY IF EXISTS "Anon full access personal_info" ON personal_info;
CREATE POLICY "Anon full access personal_info" ON personal_info FOR ALL USING (true);

DROP POLICY IF EXISTS "Anon full access projects" ON projects;
CREATE POLICY "Anon full access projects" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Anon full access services" ON services;
CREATE POLICY "Anon full access services" ON services FOR ALL USING (true);

DROP POLICY IF EXISTS "Anon full access process_steps" ON process_steps;
CREATE POLICY "Anon full access process_steps" ON process_steps FOR ALL USING (true);

DROP POLICY IF EXISTS "Anon full access testimonials" ON testimonials;
CREATE POLICY "Anon full access testimonials" ON testimonials FOR ALL USING (true);

DROP POLICY IF EXISTS "Anon full access messages" ON messages;
CREATE POLICY "Anon full access messages" ON messages FOR ALL USING (true);

-- ==========================================================================
-- INITIAL DATA SEEDING
-- ==========================================================================

-- Seed Personal Info
INSERT INTO personal_info (
  id, name, role_badge, headline_start, headline_gradient, headline_end,
  subheadline, avatar_text, status_badge, github_url, linkedin_url,
  email, phone, calendly_url, location, hero_stats, about_data
) VALUES (
  1,
  'Bilal Faisal',
  'Senior Full Stack & Cloud Engineer',
  'Engineering',
  'Scalable Web Platforms',
  '& High-Performance Cloud Architectures.',
  'I bridge complex business logic with clean, scalable code. Specializing in high-concurrency Node.js/TypeScript backends, modern Next.js frontends, and cloud-native systems.',
  'BF',
  'Available for Q2/Q3 Projects & Contracts',
  'https://github.com/BilalFaisaldev',
  'https://linkedin.com/',
  'contact@bilalfaisal.dev',
  '+92 300 1234567',
  'https://calendly.com/',
  'Islamabad, PK (Remote Worldwide)',
  '[
    {"label": "Shipped Apps", "value": "20+"},
    {"label": "Uptime Reliability", "value": "99.9%"},
    {"label": "Client Satisfaction", "value": "100%"}
  ]'::jsonb,
  '{
    "tag": "ENGINEERING PHILOSOPHY",
    "title": "Building Resilient Systems That Scale Under Pressure",
    "bioText": "With over 5 years of engineering experience across the entire development lifecycle, I specialize in crafting full-stack web applications that combine snappy user interfaces with ultra-reliable, high-throughput backends. I prioritize clean domain-driven architecture, robust type safety, automated end-to-end testing, and automated CI/CD pipelines.",
    "experienceYears": "5+",
    "endpointsDeployed": "150+",
    "happyClients": "18+",
    "corePillars": [
      {"title": "Type-Safe & Clean Code", "desc": "Strict TypeScript, functional patterns, and modular domain architecture."},
      {"title": "Resilient Cloud Backends", "desc": "Microservices, distributed caching with Redis, and optimized database indexing."},
      {"title": "Automated QA & CI/CD", "desc": "Comprehensive unit and E2E testing using Jest, Vitest, and Playwright."}
    ],
    "techRadarNow": ["Next.js 15 App Router", "AI Agents & LLM Tooling", "Serverless PostgreSQL", "Distributed WebSockets"]
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role_badge = EXCLUDED.role_badge,
  headline_start = EXCLUDED.headline_start,
  headline_gradient = EXCLUDED.headline_gradient,
  headline_end = EXCLUDED.headline_end,
  subheadline = EXCLUDED.subheadline,
  status_badge = EXCLUDED.status_badge,
  hero_stats = EXCLUDED.hero_stats,
  about_data = EXCLUDED.about_data;

-- Seed Projects
INSERT INTO projects (id, type, title, subtitle, short_description, full_description, tags, live_url, github_url, featured)
VALUES
(
  'grabyourguide',
  'client',
  'GrabYourGuide',
  'Tour & Experience Booking Marketplace',
  'Developed a full-featured marketplace platform for tours, enabling suppliers to onboard, list tours, manage bookings, and set dynamic pricing with Stripe payment gateways.',
  'Developed a comprehensive marketplace platform connecting travelers with verified tour guides and local experiences worldwide.\n\nKey Technical Accomplishments:\n• Multi-vendor onboarding and verification pipeline with custom supplier dashboards.\n• Dynamic availability calendaring and instant real-time booking reservation locks.\n• Split payment processing and commission management via Stripe Connect.\n• Role-based administrative portal with revenue analytics and chargeback management.',
  '["Node.js", "Express.js", "PostgreSQL", "Stripe Connect", "Redis", "React"]'::jsonb,
  'https://example.com/grabyourguide',
  '',
  true
),
(
  'pastapapers',
  'client',
  'PastaPapers',
  'AI-Powered Exam Preparation & Tutoring Platform',
  'Engineered an AI-assisted examination prep system that processes structured exam questions, performs automatic grading, and provides instant interactive AI tutoring feedback.',
  'Designed and built an intelligent examination study platform that converts thousands of PDF exam papers into structured interactive modules.\n\nKey Technical Accomplishments:\n• Automated question parsing and indexing pipeline for multiple educational boards.\n• Interactive AI assessment engine with token-gated tutoring assistance for students.\n• Subscription and paywall integration with Lemon Squeezy and server-side webhook enforcement.\n• Comprehensive student diagnostics identifying topic-level knowledge gaps and score trends.',
  '["Next.js", "TypeScript", "Python", "OpenAI API", "Lemon Squeezy", "Cloudflare"]'::jsonb,
  'https://example.com/pastapapers',
  '',
  true
),
(
  'codecrate',
  'personal',
  'CodeCrate',
  'Minimalist Developer Snippet & Secret Manager',
  'A developer-first snippet organizer featuring encrypted storage, instant fuzzy search, syntax highlighting for 50+ languages, and rapid keyboard navigation.',
  'Built as a fast, keyboard-centric snippet manager for developers who value speed, privacy, and zero bloat.\n\nKey Technical Accomplishments:\n• Client-side encryption for sensitive config files and API keys before cloud backup.\n• Sub-millisecond fuzzy search with tag filtering and keyboard shortcuts.\n• Beautiful dark/light syntax themes and instant clipboard copy actions.\n• Offline-first support with IndexedDB local caching.',
  '["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite"]'::jsonb,
  'https://example.com/codecrate',
  'https://github.com/example/codecrate',
  true
),
(
  'tlyne',
  'personal',
  'Tlyne',
  'Collaborative Agile Project Management Suite',
  'Designed and developed a real-time project management web application with interactive kanban boards, sprint planners, and automated test coverage with Playwright.',
  'A full-stack collaborative workspace tool designed to simplify sprint planning and team task tracking.\n\nKey Technical Accomplishments:\n• Real-time drag-and-drop Kanban boards with optimistic UI updates.\n• Relational database schema with complex workspace permissions built on Prisma & PostgreSQL.\n• Comprehensive end-to-end test suite using Playwright covering core critical user journeys.\n• Fast keyboard navigation, markdown task notes, and timeline forecasting.',
  '["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Playwright", "WebSockets"]'::jsonb,
  'https://example.com/tlyne',
  'https://github.com/example/tlyne',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Services
INSERT INTO services (id, title, description, bullets, icon)
VALUES
(
  1,
  'Full-Stack Web Applications',
  'End-to-end web applications engineered from scratch. From interactive responsive frontends to scalable cloud databases and payment systems.',
  '["Custom SaaS & multi-tenant platforms", "Interactive booking & marketplace engines", "Real-time collaboration dashboards", "High-performance SPAs with Next.js"]'::jsonb,
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>'
),
(
  2,
  'API & Microservice Architectures',
  'High-throughput REST and GraphQL APIs with robust security, database indexing, rate limiting, and zero-downtime scalability.',
  '["Microservice design & implementation", "Stripe & LemonSqueezy payment integrations", "OAuth2, JWT & RBAC access control", "Redis caching & sub-50ms API latency"]'::jsonb,
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>'
),
(
  3,
  'Performance & AI Integrations',
  'Upgrading existing software systems with LLM integration, automated agent workflows, code refactoring, and Core Web Vitals optimization.',
  '["OpenAI & Gemini API agent workflows", "Playwright & Vitest automated testing suites", "CWV (LCP/INP) performance audits", "Legacy codebase modernizations"]'::jsonb,
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path></svg>'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Process Steps
INSERT INTO process_steps (id, step, title, description)
VALUES
(1, '01', 'Technical Discovery', 'Deep dive into business goals, functional requirements, API contracts, and database relationship diagrams.'),
(2, '02', 'System Architecture', 'Drafting schema designs, selecting optimal frameworks, designing security boundaries, and setting up staging environments.'),
(3, '03', 'Sprint Execution', 'Iterative test-driven development with weekly demos, clean git commits, and regular stakeholder communication.'),
(4, '04', 'Production Launch', 'Zero-downtime deployment, CDN edge caching, structured logging, performance monitoring, and complete documentation.')
ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (id, name, role, quote, full_quote, rating)
VALUES
(
  1,
  'Ibrahim Hussain',
  'CEO, PastaPapers',
  'Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. The speed and quality of delivery exceeded all our expectations.',
  'Bilal did an exceptional job building our platform from scratch. He handled everything—filters, past questions, AI marking, and the tutor—without overcomplicating things. He was quick with fixes, proactive in communication, and delivered unbelievable speed while maintaining clean code. I''m genuinely thrilled with the results and would work with him again on any future project.',
  5
),
(
  2,
  'Omar Amjad',
  'Product Founder',
  'What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn''t a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards.',
  'What stood out was how clearly he communicated and how quickly he understood what I was trying to build. This wasn''t a basic website, it was a full marketplace with booking logic, Stripe integration, and admin dashboards. He didn''t just code what was requested; he thought ahead and gave architectural suggestions that made the product substantially better.',
  5
),
(
  3,
  'Abdullah Fahad',
  'Founder, Novu Labs',
  'The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. 100% satisfied.',
  'The collaboration was remarkably smooth. Bilal is well-organized, keeps you updated at every step, delivers strictly on schedule, and writes maintainable, clean code. Any revision was handled with utmost professionalism. I feel completely confident recommending him.',
  5
)
ON CONFLICT (id) DO NOTHING;
