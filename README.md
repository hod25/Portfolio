# GitHub Portfolio

An **automated GitHub portfolio** built with **Next.js** and **TypeScript** that dynamically fetches and showcases public repositories with sanitized README previews, language badges, star counts, and a live GitHub user search viewer.

---

## ✨ Features

- ⚡ **Fast & SEO-Friendly (ISR)** – Home page pre-renders GitHub projects via Incremental Static Regeneration (`revalidate: 1h`) with graceful client-side fallback.
- 🔍 **GitHub Portfolio Viewer (`/search`)** – Search any GitHub username to inspect their highlighted repositories via a cached server-side API route (`/api/github`).
- 🛡️ **Safe README Previews** – Parses Markdown with `marked`, resolves relative GitHub image URLs automatically, and sanitizes HTML with `sanitize-html` to prevent XSS.
- 📄 **Live Resume Endpoint (`/api/resume`)** – Streams the latest PDF directly from Google Docs with HTTP caching and a local fallback (`public/Hod_Mitrany_Resume.pdf`).
- 🎨 **Dark / Light Mode** – Respects system preference, persists in `localStorage`, and initializes before first paint to prevent theme flicker.
- 📐 **Flexible Layouts & Responsive UI** – Switch between Grid, Two-Per-Row, and One-Per-Row views on desktop, with an accessible mobile-first layout.

---

## 🛠 Tech Stack

- [Next.js 15](https://nextjs.org/) (Pages Router, ISR, API Routes)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (`strict` mode)
- [marked](https://marked.js.org/) & [sanitize-html](https://github.com/apostrophecms/sanitize-html)
- [GitHub REST API](https://docs.github.com/en/rest)

---

## 📂 Project Structure

```text
├── components/
│   ├── ReadmeViewer.tsx    # Renders sanitized README HTML & hides broken images
│   ├── RepoCard.tsx        # Project card with language badge, stars, and README preview
│   ├── ResumeDropdown.tsx  # Accessible resume menu (Download, View PDF, Google Docs)
│   ├── ThemeContext.tsx    # Shared dark/light theme state
│   └── ViewControls.tsx    # Layout switcher (grid / 2-per-row / 1-per-row)
├── lib/
│   ├── github.ts           # Typed GitHub REST API client with token fallback
│   └── markdown.ts         # Markdown parsing, relative image resolution & HTML sanitization
├── pages/
│   ├── api/
│   │   ├── github.ts       # Cached GitHub portfolio API route
│   │   └── resume.ts       # Cached resume PDF proxy with local fallback
│   ├── search/index.tsx    # Interactive GitHub username search page
│   ├── _app.tsx            # ThemeProvider wrapper & global styles
│   ├── _document.tsx       # Zero-FOUC theme initialization script
│   ├── download.tsx        # Direct resume download redirect page
│   └── index.tsx           # Main portfolio page (ISR)
├── styles/
│   └── globals.css         # Themeable CSS variables & responsive styles
└── systemd/
    ├── portfolio.service   # Production systemd unit file
    └── update.sh           # Deployment script
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/hod25/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Optional)

Create a `.env.local` file to raise GitHub API rate limits (recommended for production):

```env
GITHUB_TOKEN=your_github_personal_access_token
```

If `GITHUB_TOKEN` is omitted or invalid, the app automatically falls back to unauthenticated GitHub REST API requests.

### Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server
- `npm run typecheck` – Run TypeScript type checking (`tsc --noEmit`)
- `npm run download-resume` – Refresh the local fallback PDF in `public/Hod_Mitrany_Resume.pdf`
