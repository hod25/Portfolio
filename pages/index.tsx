import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import RepoCard from "../components/RepoCard";
import ResumeDropdown from "../components/ResumeDropdown";
import { useTheme } from "../components/ThemeContext";
import ViewControls, { ViewMode } from "../components/ViewControls";
import { fetchPortfolioData, GitHubRepo, PortfolioData } from "../lib/github";

const DEFAULT_USERNAME = "hod25";

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
        <link rel="icon" href="/Black Briefcase Icon.png" />
        <title>Hod Mitrany | GitHub Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="הפורטפוליו של הוד מיטרני - מפתח תוכנה, פרויקטים, קוד פתוח, GitHub Portfolio"
        />
        <meta
          name="keywords"
          content="Hod Mitrany, הוד מיטרני, GitHub Portfolio, פורטפוליו, קוד פתוח, פיתוח תוכנה"
        />
        <meta name="author" content="Hod Mitrany" />
        <meta property="og:title" content="Hod Mitrany | GitHub Portfolio" />
        <meta
          property="og:description"
          content="הפורטפוליו של הוד מיטרני - מפתח תוכנה, פרויקטים, קוד פתוח"
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
            <ResumeDropdown />
          </div>

          <div className="try-button-container">
            <Link href="/search" className="try-button">
              Try it yourself 🔍
            </Link>
          </div>
        </header>

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
