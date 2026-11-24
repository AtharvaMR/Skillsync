# SkillSync

**Better Skills. Better Jobs. Stronger Bharat.**

An evidence-driven **Labour-Market Intelligence, Skill-Development Outcome Tracking, and Curriculum Alignment Platform** designed to close the loop between real industry demand, training curricula, and long-term employment outcomes.

---

## Overview

SkillSync addresses two core challenges in the skill-development ecosystem:

1. **Industry–Curriculum Misalignment** — Identifying skills that are outdated, oversupplied, under-covered, or missing compared to live job-market demand.
2. **Employment Outcome Visibility** — Tracking longitudinal outcomes beyond enrolment and certification, including placement, retention, wage progression, employer validation, and non-placement drivers.

### Core Methodology: Digital Kaizen for Skill Ecosystems

Instead of designing training strictly from static historical documents, SkillSync models a continuous feedback loop:

- **Genchi Genbutsu** — Observe live industry skill demand and employer signals.
- **PDCA (Plan → Do → Check → Act)** — Align curricula, deploy training interventions, track candidate outcomes, and act on verified skill gaps.
- **Continuous Improvement** — Prioritize actionable recommendations (`ADD`, `REMOVE`, `UPDATE`, `RETRAIN`, `INVEST`) backed by evidence and confidence scores.

---

## Key Features & Modules

### Dashboards & Intelligence Views (`/dashboard/*`)

- **Overview (`/dashboard`)** — Ecosystem KPIs, skill demand trends, placement & retention curves, and emerging skills.
- **Labour Market (`/dashboard/labour-market`)** — Job demand dynamics, sector hiring activity, and market insights.
- **Skills (`/dashboard/skills`)** — Skill demand classification (`high_demand`, `emerging`, `stable`, `declining`, `oversupplied`) and trend tracking.
- **Courses (`/dashboard/courses`)** & **Curriculum (`/dashboard/curriculum`)** — Course Health Score breakdown (Industry Alignment, Skill Coverage, Emerging Skill Coverage, Placement Performance, Employer Satisfaction, Curriculum Freshness) and alignment matrices.
- **Employers (`/dashboard/employers`)** — Employer directory, validation workflows, and feedback insights.
- **Candidates (`/dashboard/candidates`)** — Role-aware candidate tracking and career pathway support.
- **Training Outcomes (`/dashboard/outcomes`)** — Placement funnel, retention intervals (30/60/90/180/365-day follow-ups), wage bands, and non-placement reasons.
- **Districts (`/dashboard/districts`)** — District-level supply/demand planning across Indian states.
- **Trainers (`/dashboard/trainers`)** & **Equipment (`/dashboard/equipment`)** — Trainer competency gaps, upskilling plans, and lab/equipment readiness.
- **Recommendations (`/dashboard/recommendations`)** — Evidence-backed curriculum and infrastructure recommendations with validation states.
- **Kaizen Loop (`/dashboard/kaizen`)** — Interactive PDCA continuous improvement tracking.
- **Reports (`/dashboard/reports`)**, **Data Sources (`/dashboard/data-sources`)**, and **Settings (`/dashboard/settings`)**.

### AI Intelligence Layer (`src/lib/ai/` & `/api/ai/*`)

Powered by the Google Gemini API (`@google/generative-ai`) with modular provider abstraction and graceful fallback handling:

- **Skill Extractor** (`POST /api/ai/skill-extract`) — Extracts and categorizes skills (`hard_skill`, `soft_skill`, `tool`, `technology`) from job descriptions.
- **Curriculum Recommendations** (`POST /api/ai/recommendations`) — Generates structured curriculum improvement actions tailored to sector trends.
- **Career Pathway Generator** (`POST /api/ai/career-pathway`) — Produces step-by-step upskilling roadmaps from current skills to target roles.
- **Demand & Gap Analyzers** (`src/lib/ai/demand-analyzer.ts`, `src/lib/ai/gap-analyzer.ts`) — Weighted demand scoring, course health computation, and skill/trainer/equipment gap classification.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript 5
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide Icons
- **Data Visualization:** Recharts
- **Authentication:** JWT (`jose`) with `httpOnly` session cookies (`skillsync-token`)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
- **Database Tooling:** `better-sqlite3` (plus simulated demo dataset in `src/lib/mock-data.ts`)

---

## Project Structure

```text
skillsync/
├── public/                        # Static SVG assets
├── src/
│   ├── app/
│   │   ├── api/                   # REST & AI API endpoints (auth, analytics, data, Gemini AI)
│   │   ├── dashboard/             # 16 intelligence & analytics dashboard pages
│   │   ├── login/                 # Role-based portal sign-in page
│   │   ├── globals.css            # Global styles and Tailwind configuration
│   │   ├── layout.tsx             # Root application layout
│   │   └── page.tsx               # Public landing page
│   ├── components/
│   │   ├── cards/                 # Domain cards (Kaizen loop, career pathway, gaps, districts)
│   │   ├── charts/                # Recharts wrappers (area, bar, line, pie, radar, funnel)
│   │   ├── dashboard/             # Sidebar, topbar, demo environment banner
│   │   └── ui/                    # Reusable badges, KPI cards, tables, filters, search
│   ├── lib/
│   │   ├── ai/                    # Provider abstraction, skill extractor, analyzers, recommender
│   │   ├── auth.ts                # JWT auth helpers & role-based demo accounts
│   │   ├── constants.ts           # Navigation, sectors, states, wage bands, weights
│   │   ├── mock-data.ts           # Simulated Indian skilling ecosystem dataset
│   │   └── utils.ts               # Formatting and status/demand helpers
│   └── types/                     # Shared TypeScript domain interfaces
├── .env.example                   # Environment variable template
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Google Gemini API key (optional — required for live AI endpoints under `/api/ai/*`)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AtharvaMR/Skillsync.git
   cd Skillsync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and set your secrets:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_secure_jwt_secret
   NEXT_PUBLIC_APP_NAME=SkillSync
   NEXT_PUBLIC_APP_TAGLINE=Better Skills. Better Jobs. Stronger Bharat.
   NEXT_PUBLIC_DEMO_MODE=true
   DATABASE_URL=file:./dev.db
   ```

   > **Note:** Never commit `.env.local` or real API keys to version control.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the built production server |
| `npm run lint` | Run ESLint checks |

---

## Demo Accounts

In demo mode (`NEXT_PUBLIC_DEMO_MODE=true`), six role-based accounts are available on `/login` (all using password `SkillSync2024!`):

| Role | Email |
| :--- | :--- |
| **Government Admin** | `admin@skillsync.gov.in` |
| **Institute** | `institute@skillsync.gov.in` |
| **Trainer** | `trainer@skillsync.gov.in` |
| **Employer** | `employer@skillsync.gov.in` |
| **Student** | `student@skillsync.gov.in` |
| **Analyst** | `analyst@skillsync.gov.in` |

> **Note:** The dashboard currently operates in a **Demo Environment** using simulated Indian skilling ecosystem data in `src/lib/mock-data.ts`.

---

## API Routes

- **Authentication:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Ecosystem Data:** `GET /api/analytics`, `GET /api/skills`, `GET /api/jobs`, `GET /api/courses`, `GET /api/employers`, `GET /api/candidates`, `GET /api/districts`, `GET /api/outcomes`, `GET /api/trainers`, `GET /api/recommendations`, `GET/POST /api/feedback`
- **Gemini AI:** `POST /api/ai/skill-extract`, `POST /api/ai/recommendations`, `POST /api/ai/career-pathway`
