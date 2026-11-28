// All copy for the home page lives here. Keep it in sync with the resume
// (public/Hod_Mitrany_Resume.pdf). Never put internal IPs, hostnames or
// paths from the home lab in this file: the site is public.

export const PROFILE = {
  name: "Hod Mitrany",
  role: "Junior Software Engineer",
  tagline: "Full Stack & DevOps",
  intro:
    "I build full-stack web and mobile apps with Node.js, React and Python, run my own self-hosted infrastructure, " +
    "and ship everything with tests and CI/CD. Final-semester Computer Science student, former IDF IT team lead.",
  availability: "Open to junior software, full stack and DevOps roles · Israel",
  email: "hodmitrany@gmail.com",
  github: "https://github.com/hod25",
  githubUser: "hod25",
  linkedin: "https://www.linkedin.com/in/hod-mitrany/",
};

export const STATS: { value: string; label: string }[] = [
  { value: "7", label: "VMs & containers in production at home" },
  { value: "85K+", label: "photos served to 6 users" },
  { value: "600+", label: "users supported as IDF IT team lead" },
  { value: "2027", label: "B.Sc. Computer Science" },
];

export const ABOUT: string[] = [
  "My path into tech started in the IDF, where I led a 7-person IT support team for more than 600 users. " +
    "Since then I have worked as a Python developer at BioView, automating the preparation of image datasets for AI training, " +
    "and built full-stack apps from serverless web platforms to a native Android alarm app.",
  "At home I run a Proxmox server my household relies on every day: storage, photos, media, DNS and home automation, " +
    "with layered backups, monitoring and zero open inbound ports. It is where I learn by breaking and fixing real systems.",
];

export const SKILL_GROUPS: { label: string; items: string[] }[] = [
  { label: "Development", items: ["TypeScript", "Python", "Node.js", "Express", "React", "Next.js", "Flask", "Socket.io", "Capacitor", "MongoDB", "MySQL", "Java", "C#", "C++"] },
  { label: "Infrastructure", items: ["Proxmox VE", "Docker", "Docker Compose", "TrueNAS", "ZFS", "Linux", "VMware", "Active Directory"] },
  { label: "Networking & Security", items: ["Cloudflare Zero Trust", "Twingate (ZTNA)", "WireGuard", "Nginx Proxy Manager", "Pi-hole", "NFS / SMB"] },
  { label: "Cloud & CI/CD", items: ["AWS EC2", "GitHub Actions", "Netlify", "Dependabot"] },
  { label: "Automation & Monitoring", items: ["Python", "Bash", "systemd timers", "Git", "rclone", "Uptime Kuma", "healthchecks.io"] },
];

export interface TimelineItem {
  title: string;
  org: string;
  period: string;
  points: string[];
}

export const EXPERIENCE: TimelineItem[] = [
  {
    title: "Software Developer (Student), Python & Data Automation",
    org: "BioView",
    period: "2023 – 2025",
    points: [
      "Built a Python pipeline that organized and validated thousands of images into structured AI training datasets.",
      "Automated bounding-box extraction and pre-processing for Detectron2 training in one end-to-end script.",
      "Worked in an agile R&D environment, troubleshooting data issues and supporting model training runs.",
    ],
  },
  {
    title: "IT Specialist & Team Lead",
    org: "IDF",
    period: "2019 – 2022",
    points: [
      "Led a 7-member technical support team serving 600+ users in mission-critical environments.",
      "Troubleshot networking, OS, hardware and enterprise systems; automated internal workflows.",
    ],
  },
  {
    title: "B.Sc. Computer Science",
    org: "College of Management Academic Studies",
    period: "Expected 2027",
    points: [
      "Coursework includes cloud deployment on AWS EC2 with a Git-based CI/CD pipeline.",
      "Member of the Hackeriot cybersecurity team.",
    ],
  },
];

export const HOMELAB = {
  title: "Self-Hosted Infrastructure",
  subtitle: "A single Proxmox host running the services my household uses every day.",
  stats: [
    { value: "2 + 5", label: "VMs + LXC containers" },
    { value: "2×4TB", label: "ZFS mirror" },
    { value: "5", label: "off-site backup jobs" },
    { value: "0", label: "open inbound ports" },
  ],
  points: [
    "Home Assistant, TrueNAS, Jellyfin with iGPU transcoding, Pi-hole DNS and a Docker stack, plus Immich photos for 6 users (85K+ photos).",
    "Layered backups: nightly vzdump to NFS, daily and weekly ZFS snapshots, and 5 off-site sync jobs, with rclone crypt for sensitive data.",
    "Host and Home Assistant configuration in Git with automated daily pushes and age-encrypted secrets.",
    "Monitoring with systemd failure hooks, Uptime Kuma, an external healthchecks.io heartbeat and phone alerts through Home Assistant.",
  ],
  story: {
    title: "Why I migrated off WireGuard + Nginx Proxy Manager",
    text:
      "I first exposed services through WireGuard and Nginx Proxy Manager, aiming for a single login page for every user. " +
      "Home Assistant did not officially support that setup, so I moved to Cloudflare Tunnel for public apps and Twingate " +
      "(zero-trust access) for admin tools. Nothing listens on an open port anymore.",
  },
  note: "The configuration repository is private because it describes a live network. I am happy to walk through it in an interview.",
};

export interface Project {
  name: string;
  repo: string; // GitHub repo name under PROFILE.githubUser
  summary: string;
  highlights: string[];
  stack: string[];
  badge?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Portfolio Website",
    repo: "Portfolio",
    summary: "This site. Next.js and TypeScript with a full CI/CD pipeline.",
    highlights: [
      "GitHub Actions CI on every PR: type-check, dependency audit, build.",
      "Automatic Netlify deployment, with Dependabot keeping dependencies patched.",
      "Includes a GitHub portfolio viewer for any user.",
    ],
    stack: ["Next.js", "TypeScript", "GitHub Actions", "Netlify"],
    badge: "CI/CD",
  },
  {
    name: "Hourly Timer for Home Assistant",
    repo: "hourly-timer-integration",
    summary: "Open-source Home Assistant integration with a circular timer card for switches, lights and fans.",
    highlights: [
      "Published and installable via HACS.",
      "pytest test suite and GitHub Actions validation on every push.",
    ],
    stack: ["Python", "JavaScript", "pytest", "GitHub Actions", "HACS"],
    badge: "Open source",
  },
  {
    name: "Wedding Invitation System",
    repo: "Wedding-system",
    summary: "Guest management web app with a WhatsApp bot that sent invitations to real guests and tracked RSVPs.",
    highlights: [
      "Excel import, QR codes and RSVP tracking.",
      "Dockerized, with a Selenium-driven WhatsApp bot synced to the web server.",
    ],
    stack: ["Python", "Flask", "Selenium", "Docker"],
    badge: "Real users",
  },
  {
    name: "Aura eCommerce",
    repo: "aura",
    summary: "Full-stack eCommerce platform with catalog, auth, cart and checkout.",
    highlights: [
      "React frontend, Express API and MySQL orchestrated with Docker Compose.",
      "Health checks, service dependencies and an auto-seeded database.",
    ],
    stack: ["TypeScript", "React", "Express", "MySQL", "Docker Compose"],
  },
  {
    name: "ProSafe: Helmet Detection",
    repo: "FSD-Project",
    summary: "Team project (5 developers): real-time detection of workers without helmets in live camera streams.",
    highlights: [
      "My part: work on the YOLO detection algorithm, plus user management, profiles and login.",
      "Microservices (client, server, detection service) managed with PM2.",
    ],
    stack: ["Python", "YOLO", "Next.js", "PM2"],
    badge: "Team",
  },
];

export const NAV: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "homelab", label: "Home Lab" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
