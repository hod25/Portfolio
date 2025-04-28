"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

type ReadmeViewerProps = {
  repoUrl: string;
};

export default function ReadmeViewer({ repoUrl }: ReadmeViewerProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
async function fetchReadme() {
  try {
    // מנקה את כתובת ה-Repo
    const cleanedUrl = repoUrl
      .replace("https://github.com/", "")
      .replace(/\/(tree|blob)\/[^\/]+/, "");

    // ניסיון ראשון: branch בשם 'main'
    let response = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/main/README.md`);

    // אם הניסיון הראשון נכשל, מנסים 'master'
    if (!response.ok) {
      response = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/master/README.md`);
    }

    if (!response.ok) {
      throw new Error("Failed to fetch README from both main and master branches");
    }

    const markdown = await response.text();
    const html = marked(markdown, { async: false });
    setContent(html);

  } catch (error) {
    console.error("Error loading README:", error);
  }
}

    fetchReadme();
  }, [repoUrl]);

  if (!content) {
    return <p>טוען את התוכן...</p>;
  }

  return (
    <div
      className="prose mx-auto p-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
