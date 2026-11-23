import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import RepoCard from "../components/RepoCard";
import ResumeDropdown from "../components/ResumeDropdown";
import { useTheme } from "../components/ThemeContext";
import ViewControls, { ViewMode } from "../components/ViewControls";
import { fetchPortfolioData, GitHubRepo, PortfolioData } from "../lib/github";

const DEFAULT_USERNAME = "hod25";
const CONTACT_EMAIL = "hodmitrany@gmail.com";

const SKILL_GROUPS: { label: string; items: string[] }[] = [
  { label: "Infrastructure", items: ["Proxmox VE", "Docker", "TrueNAS / ZFS", "Linux", "VMware"] },
  { label: "Networking & Security", items: ["Cloudflare Zero Trust", "Twingate", "WireGuard", "Nginx Proxy Manager", "Pi-hole"] },
  { label: "Cloud & CI/CD", items: ["AWS", "GitHub Actions", "Netlify", "Dependabot"] },
  { label: "Development", items: ["Python", "TypeScript", "Node.js", "React", "Next.js", "C#", "Java"] },
];

const HOMELAB_POINTS: string[] = [
  "Proxmox host running 2 VMs and 5 LXC containers: Home Assistant, TrueNAS, Jellyfin (iGPU transcoding), Pi-hole DNS and a Docker stack.",
  "Immich photo platform for 6 users with 85K+ photos, stored on a ZFS mirror (2×4TB).",
  "Layered backups: nightly vzdump to NFS, daily/weekly ZFS snapshots and 5 off-site sync jobs, with rclone crypt for sensitive data.",
  "Configuration kept in Git with automated daily pushes and age-encrypted secrets.",
  "Monitoring with systemd failure hooks, Uptime Kuma, an external healthchecks.io heartbeat and phone alerts via Home Assistant.",
  "Remote access through Cloudflare Tunnel and Twingate (ZTNA), migrated from WireGuard + Nginx Proxy Manager.",
];

interface HomeProps {
  initialRepos: GitHubRepo[];
  initialBio: string;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const data = await fetchPortfolioData(DEFAULT_USERNAME);

  return {
    props: {
      initialRepos: data.repos,
      initialBio: data.user?.bio ?? "",
    },
    revalidate: 3600,
  };
};

export default function Home({ initialRepos, initialBio }: HomeProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos);
  const [bio, setBio] = useState<string>(initialBio);
  const [loading, setLoading] = useState<boolean>(initialRepos.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Fallback client fetch only if build-time ISR returned no repos (e.g. offline build)
  useEffect(() => {
    if (initialRepos.length > 0) return;

    let cancelled = false;

    const loadFallback = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/github?username=${encodeURIComponent(DEFAULT_USERNAME)}`
        );
        const data: PortfolioData = await res.json();
        if (cancelled) return;

        if (!res.ok || data.error) {
          setError(data.error || "Failed to load projects from GitHub.");
          return;
        }

        setRepos(data.repos);
        setBio(data.user?.bio ?? "");
      } catch {
        if (!cancelled) {
          setError("Failed to load projects from GitHub.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFallback();
    return () => {
      cancelled = true;
    };
  }, [initialRepos.length]);

  return (
    <div className="page-wrapper">
      <Head>
        <title>Hod Mitrany | Junior DevOps Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Hod Mitrany – Junior DevOps engineer: self-hosted infrastructure, automation, CI/CD and software projects."
        />
        <meta
          name="keywords"
          content="Hod Mitrany, הוד מיטרני, DevOps, Proxmox, Docker, CI/CD, Portfolio, פורטפוליו"
        />
        <meta name="author" content="Hod Mitrany" />
        <meta property="og:title" content="Hod Mitrany | Junior DevOps Engineer" />
        <meta
          property="og:description"
          content="Self-hosted infrastructure, automation, CI/CD and software projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio.7112000.xyz" />
        <meta property="og:image" content="https://portfolio.7112000.xyz/b.png" />
      </Head>

      <main className="container">
        <button
          type="button"
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <header className="profile-header">
          <h1>Hello, I&apos;m Hod Mitrany</h1>
          <p className="profile-role">Junior DevOps Engineer · Infrastructure &amp; Automation</p>
          {bio && <p className="profile-bio">{bio}</p>}

          <div className="profile-links">
            <a
              href="https://www.linkedin.com/in/hod-mitrany/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin aria-hidden="true" />
              <span className="link-text">LinkedIn</span>
            </a>
            <a
              href="https://github.com/hod25"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
              aria-label="GitHub"
            >
              <FaGithub aria-hidden="true" />
              <span className="link-text">GitHub</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="profile-link"
              aria-label="Email"
            >
              <FaEnvelope aria-hidden="true" />
              <span className="link-text">Email</span>
            </a>
            <ResumeDropdown />
          </div>

          <div className="try-button-container">
            <Link href="/search" className="try-button">
              Try it yourself 🔍
            </Link>
          </div>
        </header>

        <section className="about-section" aria-labelledby="about-heading">
          <h2 id="about-heading">About</h2>
          <p>
            Final-semester Computer Science student (graduating 2027) and former IDF IT team lead
            (7 technicians, 600+ users). I build and run my own self-hosted infrastructure, automate
            operations with Python, Bash and systemd, and have worked as a Python developer at BioView,
            preparing image datasets for AI training.
          </p>
          <div className="skills-grid">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="skill-group">
                <h3>{group.label}</h3>
                <ul className="skill-chips">
                  {group.items.map((item) => (
                    <li key={item} className="language-badge">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-section" aria-labelledby="homelab-heading">
          <article className="project-card featured-card">
            <div className="project-card-header">
              <h2 id="homelab-heading">Featured: Self-Hosted Infrastructure (Home Lab)</h2>
            </div>
            <ul className="featured-list">
              {HOMELAB_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="featured-note">
              The configuration repository is private because it describes a live network. Happy to walk
              through the architecture in an interview.
            </p>
          </article>
        </section>

        <section className="projects-section">
          <div className="projects-header">
            <h2>Highlighted Projects</h2>
            <ViewControls viewMode={viewMode} onChange={setViewMode} />
          </div>

          {loading ? (
            <div className="spinner-container" role="status" aria-label="Loading projects">
              <div className="spinner" />
            </div>
          ) : error ? (
            <p className="error-message" role="alert">
              ⚠️ {error}
            </p>
          ) : repos.length === 0 ? (
            <p className="empty-message">No highlighted projects found.</p>
          ) : (
            <div className={`projects-container ${viewMode}-view`}>
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  name={repo.name}
                  description={repo.description}
                  html_url={repo.html_url}
                  language={repo.language}
                  stargazers_count={repo.stargazers_count}
                  readmeHtml={repo.readmeHtml}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Built by Hod Mitrany</p>
          <a
            href="https://www.netlify.com"
            className="netlify-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={
                darkMode
                  ? "https://www.netlify.com/assets/badges/netlify-badge-dark.svg"
                  : "https://www.netlify.com/assets/badges/netlify-badge-light.svg"
              }
              alt="Deploys by Netlify"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
