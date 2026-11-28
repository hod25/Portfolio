# Hod Mitrany – Portfolio

[![CI](https://github.com/hod25/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/hod25/Portfolio/actions/workflows/ci.yml)

Personal portfolio of a junior software engineer (full stack & DevOps), live at **[portfolio.7112000.xyz](https://portfolio.7112000.xyz)**.
Built with **Next.js** and **TypeScript**, tested by **GitHub Actions** on every pull request and deployed automatically to **Netlify**.

---

## ✨ Features

- 🧭 **Single-page portfolio**: hero, about and skills, experience timeline, featured home-lab write-up with an architecture diagram, curated projects and contact.
- 🗂️ **Content as data**: all copy lives in [`data/profile.ts`](data/profile.ts), so updating the site means editing one typed file.
- ⚡ **ISR**: the "More on GitHub" list is pre-rendered from the GitHub API and revalidated hourly.
- 🔍 **GitHub Portfolio Viewer (`/search`)**: look up any GitHub user and preview their repositories with sanitized README snippets (`marked` + `xss`, UTF-8/UTF-16 aware).
- 📄 **Resume endpoint (`/api/resume`)**: serves the PDF versioned in `public/`, inline or as a download.
- 🎨 **Dark / light mode** without a flash on load, responsive layout, keyboard focus states and reduced-motion support.

---

## 🔁 CI/CD

| Stage | Tool | What it does |
| :--- | :--- | :--- |
| CI | GitHub Actions ([`ci.yml`](.github/workflows/ci.yml)) | `npm ci` → type-check → `npm audit` (prod deps, high+) → `next build` → resume PDF check |
| Dependency updates | Dependabot ([`dependabot.yml`](.github/dependabot.yml)) | Weekly grouped PRs for npm packages and GitHub Actions |
| CD | Netlify | Deploy preview for every PR, production deploy on merge to `main` |

---

## 🛠 Tech Stack

- [Next.js 16](https://nextjs.org/) (Pages Router, ISR, API Routes) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) (`strict`)
- [marked](https://marked.js.org/) & [xss](https://github.com/leizongmin/js-xss) for safe README rendering
- [react-icons](https://react-icons.github.io/react-icons/)
- Plain CSS with theme variables (no UI framework)

---

## 📂 Project Structure

```text
├── .github/
│   ├── workflows/ci.yml        # CI pipeline
│   └── dependabot.yml          # Automated dependency updates
├── components/
│   ├── ArchitectureDiagram.tsx # Theme-aware SVG of the home lab (no internal addresses)
│   ├── ReadmeViewer.tsx        # Renders sanitized README HTML
│   ├── RepoCard.tsx            # Repository card used by /search
│   ├── ThemeContext.tsx        # Shared dark/light theme state
│   └── ViewControls.tsx        # Layout switcher for /search
├── data/
│   └── profile.ts              # All home-page content
├── lib/
│   ├── github.ts               # Typed GitHub REST client with token fallback
│   └── markdown.ts             # README snippet extraction & sanitization
├── pages/
│   ├── api/github.ts           # Cached GitHub portfolio API route
│   ├── api/resume.ts           # Resume PDF endpoint
│   ├── search/index.tsx        # GitHub portfolio viewer
│   ├── download.tsx            # Direct resume download
│   └── index.tsx               # Home page (ISR)
├── styles/
│   ├── globals.css             # Theme variables, /search styles
│   └── home.css                # Home page styles (scoped under .home)
└── systemd/                    # Optional self-hosted deployment (unit file + update script)
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/hod25/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (optional)

```env
GITHUB_TOKEN=your_github_personal_access_token
```

Raises GitHub API rate limits. If it is missing or invalid, the app falls back to unauthenticated requests.

### Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm start` – production server
- `npm run typecheck` – `tsc --noEmit`

To update the resume, replace `public/Hod_Mitrany_Resume.pdf`. To update the site's content, edit `data/profile.ts`.
