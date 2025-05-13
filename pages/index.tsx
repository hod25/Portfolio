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
        <title>Hod Mitrany - Portfolio</title>
        <meta name="description" content="Portfolio of Hod Mitrany - Software Developer" />
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
        <div className="profile-links">
          <a href="https://www.linkedin.com/in/hod-mitrany" target="_blank"><FaLinkedin/>LinkedIn</a>
          <a href="https://github.com/hod25" target="_blank"><FaGithub /> GitHub</a>
          <a href="https://docs.google.com/document/d/1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW/edit?usp=sharing&ouid=100594456677724045614&rtpof=true&sd=true" target="_blank"><FaFileAlt/>Resume (Docs)</a>
          <a href="/Hod_Mitrany_Resume.pdf" target="_blank"><FaFilePdf/>Resume (PDF)</a>
          {/* <a href="/Hod_Mitrany_Resume.pdf" download>
            <FaDownload />
          </a> */}
        </div>
        <div className="try-button-container">
          <a href="/search" className="try-button">Try it yourself 🔍</a>
        </div>
      <section className="projects-section">
        <h2>Highlighted Projects</h2>
        <div className="projects-grid">
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
              />
            ))
          )}
        </div>
      </section>
          </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} Built by Hod Mitrany
      </footer>
    </div>
  );  
}
