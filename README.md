# ⚡ Bilal Faisal — Senior Full Stack & Cloud Developer Portfolio

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Aurora_Tech-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, high-performance **Multi-Page Full-Stack Developer Portfolio** featuring an **Aurora Tech & Bento-Grid design system**, an **interactive floating IDE sandbox**, **Supabase Cloud PostgreSQL Database integration**, and a persistent **Node.js + Express + SQLite Database backend**.

---

## 🌟 Key Features

### 🎨 1. Signature Aurora Tech Design System
- **Aesthetic**: Deep Obsidian (`#07090e`) canvas with multi-layered ambient radial glows (**Electric Mint `#10b981` & Cyber Cyan `#06b6d4`**).
- **Glassmorphism**: Frosted cards with `backdrop-filter: blur(16px)` and dynamic gradient borders.
- **Theme Switcher**: Instant Dark / Light mode toggle with `localStorage` state persistence.

### 💻 2. Interactive Floating macOS IDE Sandbox
- 2-Column Hero layout with senior engineering stats strip.
- Interactive macOS code editor with window controls (🔴 🟡 🟢) and switchable tabs:
  - `developer.ts` — TypeScript developer model & functions
  - `stack.json` — Architecture & toolchain JSON specs
  - `terminal.sh` — Live Playwright test suite execution output

### 🍱 3. Modern Bento-Grid Architecture
- Modular Bento Box layout on the About page:
  - **Philosophy & Bio**: Engineering principles narrative with 3 live metric counters (`5+` Years Exp, `150+` APIs Deployed, `18+` Satisfied Clients).
  - **Tech Radar**: Active current focus (`Next.js 15`, `AI Agents & LLM Tooling`, `Serverless PostgreSQL`, `WebSockets`).
  - **Core Pillars**: Type safety, clean code, distributed resilience, and automated CI/CD.
  - **Toolkit Orbit**: Interactive categorized technology chips cloud.

### 📄 4. Multi-Page Architecture
Individual standalone pages with active navigation link indicators:
- 🏠 **Home** (`index.html`) — Hero with Live IDE, highlights, featured case studies, capabilities preview, and quick CTA.
- 👨‍💻 **About** (`about.html`) — Full Bento Grid, engineering philosophy, experience timeline, and domain specializations.
- 🛠️ **Services** (`services.html`) — Detailed offerings, deliverables checklist, 4-step architecture roadmap timeline, and engagement models.
- 📂 **Projects** (`projects.html`) — Complete portfolio catalogue with category filter tabs (**All / Client Work / Personal**), browser mockup cards, and case study modal dialogs.
- 📬 **Contact** (`contact.html`) — Direct reachout info, 30-min Calendly integration, and direct message form.

### ☁️ 5. Supabase Cloud PostgreSQL Database
- **Persistent Storage**: All portfolio data stored permanently in Supabase Cloud PostgreSQL.
- **Auto-Initialization**: Automatic fallback and real-time cloud data querying.
- **Instant Global Sync**: Fast worldwide edge access without server cold-starts.

---

## 📁 Repository Structure

```
portfolio/
├── index.html                   # Home Page
├── about.html                   # Dedicated About Me Page
├── services.html                # Dedicated Services & Workflow Page
├── projects.html                # Dedicated Projects Showcase Page
├── contact.html                 # Dedicated Contact & Consultation Page
├── css/
│   └── style.css                # Aurora Tech design system tokens & mobile responsiveness
├── js/
│   ├── config.js                # Live Supabase cloud credentials & fallback configuration
│   ├── api.js                   # Client API (Supabase Cloud + fallback)
│   └── app.js                   # Multi-page router & dynamic renderers
│
├── supabase-schema.sql          # ☁️ 1-Click Cloud PostgreSQL database schema & seeder
├── server/                      # 🗄️ LOCAL EXPRESS REST API (Optional)
│   ├── package.json             # Express, CORS, better-sqlite3
│   ├── server.js                # Express app entrypoint (Port 5000)
│   ├── database.js              # SQLite database manager & schemas
│   ├── seed.js                  # Database seeder
│   └── data/
│       └── portfolio.db         # Local SQLite database file
│
├── Dockerfile                   # Production Docker container definition
├── package.json                 # Root deployment package
├── .gitignore                   # Ignored files (node_modules, logs)
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/BilalFaisaldev/portfolio-.git
cd portfolio-
```

### 2. Install Dependencies & Start
```bash
npm install
npm start
```

### 3. Open in Browser
- 🌐 **Public Website**: [http://localhost:5000](http://localhost:5000)
- 👑 **Admin Studio**: [http://localhost:5000/admin/](http://localhost:5000/admin/)
- 🔌 **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ☁️ Free Cloud Database Setup (Supabase PostgreSQL)

Connect a permanent free cloud database so changes in your Admin Panel are saved in the cloud and instantly visible to everyone globally on GitHub Pages (`https://bilalfaisaldev.github.io/portfolio-/`):

1. **Create Free Project**: Go to **[supabase.com](https://supabase.com/)** and create a free account & project (takes 30 seconds).
2. **Run Database Schema**:
   - In your Supabase Dashboard, click on **SQL Editor** on the left menu.
   - Open the file [`supabase-schema.sql`](supabase-schema.sql) in this repo, copy all its contents, paste into the SQL Editor, and click **"Run"**.
3. **Connect to Your Portfolio**:
   - Go to Supabase **Project Settings** ➡️ **API**.
   - Copy your **Project URL** and **`anon` `public` API Key**.
   - Either paste them into `js/config.js` or open your live Admin Panel (`https://bilalfaisaldev.github.io/portfolio-/admin/`), go to **API & Backend Integration**, paste the keys, and click **Save & Connect Cloud Database**!

---

## 🌐 1-Click Free Deployment on Render.com

1. Sign in to **[Render.com](https://render.com/)** with your GitHub account.
2. Click **"New +"** ➡️ **"Web Service"**.
3. Select this repository: **`BilalFaisaldev/portfolio-`**.
4. Configure:
   - **Name**: `bilalfaisal-portfolio`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd server && npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: `Free`
5. Click **"Deploy Web Service"**.

---

## 🐳 Docker Deployment

```bash
# Build container image
docker build -t portfolio-app .

# Run container with persistent data volume
docker run -d -p 5000:5000 --name my-portfolio -v $(pwd)/server/data:/app/server/data portfolio-app
```

---

## 📬 Connect & Contact

- **Name**: Bilal Faisal
- **Role**: Senior Full Stack & Cloud Engineer
- **Email**: [contact@bilalfaisal.dev](mailto:contact@bilalfaisal.dev)
- **GitHub**: [@BilalFaisaldev](https://github.com/BilalFaisaldev)
- **LinkedIn**: [Bilal Faisal](https://linkedin.com/)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
