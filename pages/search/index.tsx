import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import RepoCard from "../../components/RepoCard";
import { useTheme } from "../../components/ThemeContext";
import ViewControls, { ViewMode } from "../../components/ViewControls";
import type { GitHubRepo, PortfolioData } from "../../lib/github";

export default function SearchPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [userInfo, setUserInfo] = useState<{ name: string; bio: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setSubmitted(true);
    setLoading(true);
    setError(null);
    setVisibleCount(4);

    try {
      const res = await fetch(
        `/api/github?username=${encodeURIComponent(trimmed)}`
      );
      const data: PortfolioData = await res.json();

      if (!res.ok || !data.user) {
        setError(data.error || "User not found on GitHub.");
        setSubmitted(false);
        return;
      }

      setRepos(data.repos);
      setUserInfo({
        name: data.user.name || data.user.login,
        bio: data.user.bio || "",
      });
    } catch {
      setError("Failed to load GitHub data. Please try again.");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setUsername("");
    setRepos([]);
    setUserInfo(null);
    setError(null);
    setVisibleCount(4);
  };

  return (
    <div className="page-wrapper">
      <Head>
        <link rel="icon" href="/Black Briefcase Icon.png" />
        <title>GitHub Portfolio Viewer</title>
        <meta name="description" content="View any GitHub user's portfolio and highlighted projects" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={`container ${!submitted ? "search-mode" : ""}`}>
        <div className="top-bar">
          <Link href="/" className="back-home-link">
            ← Back to Portfolio
          </Link>
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {!submitted ? (
          <div className="search-screen">
            <h1 className="search-title">GitHub Portfolio Viewer</h1>
            <form onSubmit={handleSubmit} className="search-form">
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                aria-label="GitHub username"
              />
              <button type="submit">🔍 Search</button>
            </form>
            {error && (
              <p className="error-message" role="alert">
                ⚠️ {error}
              </p>
            )}
          </div>
        ) : (
          <>
            {userInfo && (
              <header className="profile-header">
                <h1>{userInfo.name}</h1>
                {userInfo.bio && <p className="profile-bio">{userInfo.bio}</p>}
              </header>
            )}

            <div className="search-again-container">
              <button
                type="button"
                className="search-again-button"
                onClick={handleReset}
              >
                🔍 Search Again
              </button>
            </div>

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
                <p className="empty-message">
                  No repositories with a detailed README were found for this user.
                </p>
              ) : (
                <div className={`projects-container ${viewMode}-view`}>
                  {repos.slice(0, visibleCount).map((repo) => (
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

              {!loading && visibleCount < repos.length && (
                <div className="show-more-container">
                  <button
                    type="button"
                    className="show-more-button"
                    onClick={() => setVisibleCount((count) => count + 4)}
                  >
                    Show More
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Built by Hod Mitrany</p>
      </footer>
    </div>
  );
}
