"use client";;

import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReadmeViewer from '../components/ReadmeViewer'; 
import { FaLinkedin, FaGithub, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import RepoCard from "../components/RepoCard";
import { fetchRepos, fetchUser } from "../lib/github_hod";
import { FaDownload } from 'react-icons/fa';
import ResumeDropdown from '../components/ResumeDropdown';

type ProjectCardProps = {
  title: string;
  description: string;
  link?: string;
};

export default function Home() {
  const username = "hod25"; 
  const [repos, setRepos] = useState<any[]>([]);
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'two-per-row' | 'one-per-row'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // התחלת טעינה
      const [fetchedRepos, userData] = await Promise.all([
        fetchRepos(username),
        fetchUser(username),
      ]);
      setRepos(fetchedRepos);
      setBio(userData.bio);
      setLoading(false); // סיום טעינה
    };
  
    fetchData();
  }, []);  
  
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
        <title>Hod Mitrany | GitHub Portfolio</title>
        <meta name="description" content="הפורטפוליו של הוד מיטרני - מפתח תוכנה, פרויקטים, קוד פתוח, GitHub Portfolio" />
        <meta name="keywords" content="Hod Mitrany, הוד מיטרני, GitHub Portfolio, פורטפוליו, קוד פתוח, פיתוח תוכנה" />
        <meta name="author" content="Hod Mitrany" />
        <meta property="og:title" content="Hod Mitrany | GitHub Portfolio" />
        <meta property="og:description" content="הפורטפוליו של הוד מיטרני - מפתח תוכנה, פרויקטים, קוד פתוח" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio.7112000.xyz" />
        <meta property="og:image" content="https://portfolio.7112000.xyz/b.png" />
      </Head>
      <main className="container">
        {/* כפתור שינוי מצב כהה */}
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <h1>Hello, I'm Hod Mitrany</h1>
        <p>{bio}</p>
        {/* <div className="profile-links">
          <a href="https://www.linkedin.com/in/hod-mitrany" target="_blank"><FaLinkedin/>LinkedIn</a>
          <a href="https://github.com/hod25" target="_blank"><FaGithub /> GitHub</a>
          <a href="https://docs.google.com/document/d/1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW/edit?usp=sharing&ouid=100594456677724045614&rtpof=true&sd=true" target="_blank"><FaFileAlt/>Resume (Docs)</a>
          <a href="/Hod_Mitrany_Resume.pdf" target="_blank"><FaFilePdf/>Resume (PDF)</a>
          <a href="/Hod_Mitrany_Resume.pdf" download>
            <FaDownload />
          </a>
        </div> */}
        <div className="profile-links">
          <a href="https://www.linkedin.com/in/hod-mitrany/" target="_blank"><FaLinkedin /> <span className="link-text">LinkedIn</span></a>
          <a href="https://github.com/hod25" target="_blank"><FaGithub /> <span className="link-text">GitHub</span></a>
          <ResumeDropdown />
        </div>
        <div className="try-button-container">
          <a href="/search" className="try-button">Try it yourself 🔍</a>
        </div>
      <section className="projects-section">
        <div className="projects-header">
          <h2>Highlighted Projects</h2>
          <div className="view-controls">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`view-button ${viewMode === 'two-per-row' ? 'active' : ''}`}
              onClick={() => setViewMode('two-per-row')}
              title="Two Per Row"
            >
              ⚏
            </button>
            <button
              className={`view-button ${viewMode === 'one-per-row' ? 'active' : ''}`}
              onClick={() => setViewMode('one-per-row')}
              title="One Per Row"
            >
              ▬
            </button>
          </div>
        </div>
        <div className={`projects-container ${viewMode}-view`}>
          {loading ? (
          <div className="spinner-container">
          <div className="spinner" />
        </div>
          ) : (
            repos.map((repo: any) => (
              <RepoCard
                key={repo.id}
                name={repo.name}
                description={repo.description}
                html_url={repo.html_url}
                language={repo.language}
                viewMode={viewMode}
              />
            ))
          )}
        </div>
      </section>
          </main>
      <footer className="site-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Built by Hod Mitrany</p>
          {!darkMode && (
            <a href="https://www.netlify.com" className="netlify-badge">
              <img src="https://www.netlify.com/assets/badges/netlify-badge-light.svg" alt="Deploys by Netlify" />
            </a>
          )}
          {darkMode && (
            <a href="https://www.netlify.com" className="netlify-badge">
              <img src="https://www.netlify.com/assets/badges/netlify-badge-dark.svg" alt="Deploys by Netlify" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );  
}
