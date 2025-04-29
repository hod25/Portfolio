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
        const cleanedUrl = repoUrl
          .replace("https://github.com/", "")
          .replace(/\/(tree|blob)\/[^\/]+/, "");

        let response = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/main/README.md`);
        if (!response.ok) {
          response = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/master/README.md`);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch README from both main and master branches");
        }

        const markdown = await response.text();

        // חיתוך עד הקו התוחם הראשון (---)
        const lines = markdown.split('\n');
        const separatorIndex = lines.findIndex(line => line.trim() === '---');
        const relevantLines = separatorIndex !== -1 ? lines.slice(0, separatorIndex) : lines.slice(0, 10); // ברירת מחדל: 10 שורות אם אין ---
        const partialMarkdown = relevantLines.join('\n');

        const html = marked(partialMarkdown, { async: false });
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
