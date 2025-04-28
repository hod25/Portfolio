"use client";;

import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReadmeViewer from '../components/ReadmeViewer'; 

import RepoCard from "../components/RepoCard";
import { fetchRepos } from "../lib/github";


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
          {/* כפתור להציג README */}
          <button onClick={() => setShowReadme(!showReadme)} className="view-button">
            {showReadme ?'Show README' : 'Hide README'}
          </button>

          {/* לינק רגיל ל-GitHub */}
          <a href={link} target="_blank" rel="noopener noreferrer" className="view-button">
            View on GitHub
          </a>

          {/* הצגת README */}
          {showReadme && <ReadmeViewer repoUrl={link} />}
        </>
      )}
    </div>
  );
}

export default function Home() {
  const username = "hod25"; // תוכל לשנות פה לפי מה שתרצה
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
        <title>Hod Mitrany - Portfolio</title>
        <meta name="description" content="Portfolio of Hod Mitrany - Software Developer" />
      </Head>
      <main className="container">
                {/* כפתור שינוי מצב כהה */}
{/*         <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button> */}
        <h1>Hello, I'm Hod Mitrany</h1>
        <p>I'm a Computer Science student passionate about backend development, DevOps, full-stack web apps, and IoT projects. Here are some of my works:</p>

        <section className="projects-section">
          <h2>Highlighted Projects</h2>
          <div className="projects-grid">

            <ProjectCard
              title="DishFor - Mobile App"
              description="A full-stack mobile app developed with Kotlin, Firebase, and Cloudinary."
              link="https://github.com/hod25/Cellular-Project"
            />

            <ProjectCard
              title="Smart Home Lab"
              description="Custom-built smart home automations using Home Assistant, Reolink camera integration, energy monitoring, and MQTT devices."
              link="https://github.com/hod25/smart-home"
            />

            <ProjectCard
              title="RESTful API Project"
              description="A complete RESTful API built with Node.js, Express, TypeScript, MongoDB, fully documented with Swagger and tested with Jest."
              link="https://github.com/hod25/Internet-Project"
            />

            <ProjectCard
              title="Portfolio Website"
              description="My personal portfolio website built using Next.js and TypeScript, showcasing my work and background."
              link="https://github.com/hod25/portfolio"
            />

            <ProjectCard
              title="Mushroom Monitoring System"
              description="An IoT-based monitoring system for mushroom cultivation environments, using sensors and automated control."
              link="https://github.com/hod25/mushroom-monitor"
            />

            <ProjectCard
              title="---------"
              description=""
              link="https://github.com/hod25/mushroom-monitor"
            />
            
            <ProjectCard
              title="---------"
              description=""
              link="https://github.com/hod25/mushroom-monitor"
            />
            
            {repos.map((repo: any) => (
          <RepoCard
            key={repo.id}
            name={repo.name}
            description={repo.description}
            html_url={repo.html_url}
            language={repo.language}
          />
        ))}


            {/* <section className="github-activity">
              <h2>My GitHub Activity</h2>
              <img
                src="https://github-readme-stats.vercel.app/api?username=hod25&show_icons=true&theme=default&hide=contribs,prs"
                alt="GitHub Stats"
                style={{ maxWidth: "100%", height: "auto", marginTop: "1rem" }}
              />
              <img
                src="https://github-readme-streak-stats.herokuapp.com/?user=hod25&theme=default"
                alt="GitHub Streak"
                style={{ maxWidth: "100%", height: "auto", marginTop: "1rem" }}
              />
            </section> */}
          </div>
          </section>
          {/* <section className="github-activity">
            <h2>GitHub Contributions</h2>
            <img
          src="https://github-readme-activity-graph.vercel.app/graph?username=hod25&theme=react"
          alt="GitHub Contribution Graph"
              style={{ maxWidth: "100%", height: "auto", marginTop: "1rem" }}
            /> */}
          {/* </section> */}
      </main>
    </div>
  );
}
