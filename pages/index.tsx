import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaArrowRight, FaEnvelope, FaFileAlt, FaGithub, FaLinkedin, FaMoon, FaSun } from "react-icons/fa";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import { useTheme } from "../components/ThemeContext";
import {
  ABOUT,
  EXPERIENCE,
  HOMELAB,
  NAV,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  STATS,
} from "../data/profile";
import { fetchPortfolioData } from "../lib/github";

interface MoreRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
}

interface HomeProps {
  moreRepos: MoreRepo[];
}

const SITE_URL = "https://portfolio.7112000.xyz";
const repoUrl = (repo: string) => `${PROFILE.github}/${repo}`;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const data = await fetchPortfolioData(PROFILE.githubUser);
  const curated = new Set(PROJECTS.map((p) => p.repo.toLowerCase()));

  const moreRepos = data.repos
    .filter((repo) => !curated.has(repo.name.toLowerCase()))
    .slice(0, 6)
    .map(({ name, description, html_url, language }) => ({ name, description, html_url, language }));

  return { props: { moreRepos }, revalidate: 3600 };
};

export default function Home({ moreRepos }: HomeProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const title = `${PROFILE.name} | ${PROFILE.role}`;
  const description = `${PROFILE.name}: ${PROFILE.role}. Self-hosted infrastructure, automation, CI/CD and software projects.`;

  return (
    <div className="home">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content="Hod Mitrany, הוד מיטרני, DevOps, Proxmox, Docker, CI/CD, GitHub Actions, Portfolio" />
        <meta name="author" content={PROFILE.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/b.png`} />
        <link rel="canonical" href={SITE_URL} />
      </Head>

      <a href="#main" className="skip-link">Skip to content</a>

      <header className="nav">
        <div className="nav-inner">
          <a href="#top" className="nav-logo" aria-label="Back to top">HM</a>
          <nav aria-label="Sections">
            <ul className="nav-links">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section id="top" className="hero">
          <div className="wrap">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {PROFILE.availability}
            </p>
            <h1>
              {PROFILE.name}
              <span className="hero-role">
                {PROFILE.role} · {PROFILE.tagline}
              </span>
            </h1>
            <p className="hero-intro">{PROFILE.intro}</p>
            <div className="hero-actions">
              <a href="/api/resume" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <FaFileAlt aria-hidden="true" /> Resume
              </a>
              <a href={`mailto:${PROFILE.email}`} className="btn">
                <FaEnvelope aria-hidden="true" /> Email
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                <FaLinkedin aria-hidden="true" /> LinkedIn
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn">
                <FaGithub aria-hidden="true" /> GitHub
              </a>
            </div>
            <dl className="stats">
              {STATS.map((s) => (
                <div key={s.label} className="stat">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <div className="wrap two-col">
            <div>
              <h2 className="section-title">About</h2>
              {ABOUT.map((p) => (
                <p key={p.slice(0, 24)} className="lead">{p}</p>
              ))}
            </div>
            <div className="skills">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label} className="skill-group">
                  <h3>{group.label}</h3>
                  <ul className="chips">
                    {group.items.map((item) => (
                      <li key={item} className="chip">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="section section-alt">
          <div className="wrap">
            <h2 className="section-title">Experience &amp; Education</h2>
            <ol className="timeline">
              {EXPERIENCE.map((item) => (
                <li key={item.title} className="timeline-item">
                  <div className="timeline-head">
                    <h3>
                      {item.title} <span className="timeline-org">· {item.org}</span>
                    </h3>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Home lab */}
        <section id="homelab" className="section">
          <div className="wrap">
            <p className="kicker">Featured project</p>
            <h2 className="section-title">{HOMELAB.title}</h2>
            <p className="lead">{HOMELAB.subtitle}</p>

            <dl className="stats stats-compact">
              {HOMELAB.stats.map((s) => (
                <div key={s.label} className="stat">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="lab-grid">
              <ArchitectureDiagram />
              <div className="lab-text">
                <ul className="check-list">
                  {HOMELAB.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <aside className="story">
                  <h3>{HOMELAB.story.title}</h3>
                  <p>{HOMELAB.story.text}</p>
                </aside>
                <p className="muted small">{HOMELAB.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section section-alt">
          <div className="wrap">
            <h2 className="section-title">Projects</h2>
            <div className="project-grid">
              {PROJECTS.map((project) => (
                <article key={project.repo} className="card">
                  <div className="card-top">
                    <h3>{project.name}</h3>
                    {project.badge && <span className="badge">{project.badge}</span>}
                  </div>
                  <p>{project.summary}</p>
                  <ul className="card-points">
                    {project.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <ul className="chips chips-sm" aria-label="Tech stack">
                    {project.stack.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                  <a
                    href={repoUrl(project.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                    aria-label={`${project.name} on GitHub`}
                  >
                    <FaGithub aria-hidden="true" /> View code <FaArrowRight aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>

            {moreRepos.length > 0 && (
              <div className="more">
                <h3>More on GitHub</h3>
                <ul className="more-list">
                  {moreRepos.map((repo) => (
                    <li key={repo.name}>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                      {repo.language && <span className="more-lang">{repo.language}</span>}
                      {repo.description && <span className="more-desc">{repo.description}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="viewer-cta">
              Built a GitHub portfolio viewer too:{" "}
              <Link href="/search">try it with any username <FaArrowRight aria-hidden="true" /></Link>
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section contact">
          <div className="wrap">
            <h2 className="section-title">Let&apos;s talk</h2>
            <p className="lead">
              Looking for a junior DevOps or infrastructure role where I can keep building, automating and
              learning. The fastest way to reach me is email.
            </p>
            <div className="hero-actions">
              <a href={`mailto:${PROFILE.email}`} className="btn btn-primary">
                <FaEnvelope aria-hidden="true" /> {PROFILE.email}
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                <FaLinkedin aria-hidden="true" /> LinkedIn
              </a>
              <a href="/api/resume?download=1" className="btn">
                <FaFileAlt aria-hidden="true" /> Download resume
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <p>© {new Date().getFullYear()} {PROFILE.name}</p>
          <p className="muted">
            Next.js · TypeScript · GitHub Actions CI · deployed on Netlify ·{" "}
            <a href={repoUrl("Portfolio")} target="_blank" rel="noopener noreferrer">source</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
