﻿# GitHub Portfolio 

This is an **automated portfolio** that dynamically fetches and displays data directly from my GitHub profile.  
It showcases my public repositories, including descriptions, languages, and optionally the README files, in a modern and responsive interface built with **Next.js** and **TypeScript**.

---
This is a dynamic GitHub portfolio viewer built with Next.js.  
Enter a GitHub username and instantly view their public repositories with README previews.

---
## ✨ Features

- 🔍 **Enter a GitHub username** to view their repositories.
- 📄 Displays **repo descriptions, languages**, and optionally README content.
- 🎨 Supports **dark/light mode** with system preference detection.
- 🧠 Built with React hooks, TypeScript, and modular components.
- ⚡ Highlights projects with responsive UI and a grid layout.

---
## 🛠 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub REST API](https://docs.github.com/en/rest)

---
## 📂 Project Structure

- `/components` – Contains `RepoCard` and `ReadmeViewer` for modular display
- `/lib/github.ts` – GitHub API fetch logic
- `/pages` – Main app logic
- `darkMode` – Persistent toggle via `localStorage`

---
## 🚀 Getting Started

```bash
git clone https://github.com/hod25/Portfolio.git
cd Portfolio
npm install
npm run dev
