"use client";;

import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReadmeViewer from '../../components/ReadmeViewer'; 
import RepoCard from "../../components/RepoCard";
import { fetchRepos } from "../../lib/github_user";

type ProjectCardProps = {
  title: string;
  description: string;
  link?: string;
};

function ProjectCard({ title, description, link }: ProjectCardProps) {
  const [showReadme, setShowReadme] = useState(false);

  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {link && (
        <>
          {/* כפתור להציג README
          <button onClick={() => setShowReadme(!showReadme)} className="view-button">
            {showReadme ?'Show README' : 'Hide README'}
          </button> */}

          {/* לינק רגיל ל-GitHub */}
          <a href={link} target="_blank" rel="noopener noreferrer" className="view-button">
            {title}
          </a>

          {/* הצגת README */}
          {showReadme && <ReadmeViewer repoUrl={link} />}
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<{ name: string; bio: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      if (submitted && username) {
        setLoading(true); // התחלת טעינה
        try {
          setError(null);
          const { repos: fetchedRepos, user } = await fetchRepos(username);
  
          if (!user) {
            setError("User not found on GitHub.");
            setSubmitted(false);
            return;
          }
  
          setRepos(fetchedRepos);
          setUserInfo({
            name: user.name || user.login,
            bio: user.bio || "",
          });
        } catch (err) {
          console.error("GitHub fetch error:", err);
          setError("Failed to load GitHub data.");
          setSubmitted(false);
        } finally {
          setLoading(false); // סיום טעינה – בכל מקרה
        }
      }
    };
  
    fetchRepositories();
  }, [submitted, username]);
  
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // זיהוי המצב של המערכת והגדרת המצב הראשוני
  useEffect(() => {
    // אם יש כבר הגדרה מקומית שמורה
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // אם אין הגדרה מקומית, נגלה לפי הגדרת המערכת
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // עדכון ה-class של ה-body לפי מצב המצב כהה
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // שמירה על המצב של המצב כהה
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div>
      <Head>
      <link rel="icon" href="/Black Briefcase Icon.png" />
        <title>Portfolio</title>
        <meta name="description" content="Portfolio from GitHub" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <main className="container">
  <button
    className="dark-mode-toggle"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>

    {!submitted ? (
      <div className="search-screen">
        <h1 className="search-title">GitHub Portfolio Viewer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) {
              setSubmitted(true);
            }
          }}
          className="search-form"
        >
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <button type="submit">🔍 Search</button>
        </form>
        {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          ⚠️ {error}
        </p>
      )}

      </div>
    ) : (
      <>
        {userInfo && (
          <div className="profile-header">
            <h1>{userInfo.name}</h1>
            <p>{userInfo.bio}</p>
          </div>
        )}

        <section className="projects-section">
          <h2>Highlighted Projects</h2>
          <div className="projects-grid">
          {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          </div>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : (
          repos.slice(0, visibleCount).map((repo: any) => (
            <RepoCard
              key={repo.id}
              name={repo.name}
              description={repo.description}
              html_url={repo.html_url}
              language={repo.language}
            />
          ))
        )}
         </div>
           {visibleCount < repos.length && (
            <div className="show-more-container">
              <button
                className="show-more-button"
                onClick={() => setVisibleCount(visibleCount + 4)}
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
    © {new Date().getFullYear()} Built by Hod Mitrany
  </footer>
  </div>
  );
}
