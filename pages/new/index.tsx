"use client";;

import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReadmeViewer from '../../components/ReadmeViewer'; 

import RepoCard from "../../components/RepoCard";
import { fetchRepos } from "../../lib/github";


type ProjectCardProps = {
  title: string;
  description: string;
  link?: string;
};


export default function Home() {
  const username = "hod25"; 
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      const fetchedRepos = await fetchRepos(username);
      setRepos(fetchedRepos);
    };

    fetchRepositories();
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
      <link rel="icon" href="/favicon.ico" />
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
        <p>I'm a Computer Science student passionate about backend development, DevOps, full-stack web apps, and IoT projects. Here are some of my works:</p>

        <section className="projects-section">
          <h2>Highlighted Projects</h2>
          <div className="projects-grid">
 
            {repos.map((repo: any) => (
            <RepoCard
            key={repo.id}
            name={repo.name}
            description={repo.description}
            html_url={repo.html_url}
            language={repo.language}
            />
          ))}
          </div>
          </section>
      </main>
    </div>
  );
}
