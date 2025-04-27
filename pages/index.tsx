"use client";

import Head from 'next/head';
import styles from "./page.module.css";

type ProjectCardProps = {
  title: string;
  description: string;
  link?: string;
};

function ProjectCard({ title, description, link }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="view-button">
          View on GitHub
        </a>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Hod Mitrany - Portfolio</title>
        <meta name="description" content="Portfolio of Hod Mitrany - Software Developer" />
      </Head>
      <main className="container">
        <h1>Hello, I'm Hod Mitrany</h1>
        <p>I'm a Computer Science student passionate about backend development, DevOps, full-stack web apps, and IoT projects. Here are some of my works:</p>

        <section className="projects-section">
          <h2>Highlighted Projects</h2>
          <div className="projects-grid">

            <ProjectCard
              title="RESTful API Project"
              description="A complete RESTful API built with Node.js, Express, TypeScript, MongoDB, fully documented with Swagger and tested with Jest."
              link="https://github.com/hod25/rest-api-project"
            />

            <ProjectCard
              title="Portfolio Website"
              description="My personal portfolio website built using Next.js and TypeScript, showcasing my work and background."
              link="https://github.com/hod25/portfolio-site"
            />

            <ProjectCard
              title="PizzApp - Mobile App"
              description="A full-stack pizza ordering app developed with React Native frontend and Node.js backend."
              link="https://github.com/hod25/pizzapp"
            />

            <ProjectCard
              title="Smart Home Lab"
              description="Custom-built smart home automations using Home Assistant, Reolink camera integration, energy monitoring, and MQTT devices."
              link="https://github.com/hod25/smart-home-lab"
            />

            <ProjectCard
              title="Mushroom Monitoring System"
              description="An IoT-based monitoring system for mushroom cultivation environments, using sensors and automated control."
              link="https://github.com/hod25/mushroom-monitor"
            />
<section className="github-activity">
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
</section>

          </div>
          
        </section>
        <section className="github-activity">
  <h2>GitHub Contributions</h2>
  <img
src="https://github-readme-activity-graph.vercel.app/graph?username=hod25&theme=react"
alt="GitHub Contribution Graph"
    style={{ maxWidth: "100%", height: "auto", marginTop: "1rem" }}
  />
</section>

      </main>
    </div>
  );
}
