"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

type ReadmeViewerProps = {
  repoUrl: string;
};

export default function ReadmeViewer({ repoUrl }: ReadmeViewerProps) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReadme() {
      setLoading(true);
      setError(false);
      setContent("");

      try {
        const cleanedUrl = repoUrl
          .replace("https://github.com/", "")
          .replace(/\/(tree|blob)\/[^\/]+/, "");

        const branches = ["main", "master"];
        let markdown: string | null = null;

        for (const branch of branches) {
          const res = await fetch(`https://raw.githubusercontent.com/${cleanedUrl}/${branch}/README.md`);
          if (res.ok) {
            markdown = await res.text();
            break;
          }
        }

        if (!markdown) {
          setError(true);
          return;
        }

        // סינון שורות ריקות
        const lines = markdown.split('\n').filter(line => line.trim().length > 0);

        // אם יש שורה אחת או פחות — נחשיב את זה כרידמי לא משמעותי
        if (lines.length <= 1) {
          setError(true);
          return;
        }

        // חיתוך לפי "---" או 7 שורות
        const separatorIndex = lines.findIndex(line => line.trim() === '---');
        const relevantLines = separatorIndex !== -1 ? lines.slice(0, separatorIndex) : lines.slice(0, 7);
        const partialMarkdown = relevantLines.join('\n');

        const html: string = await marked.parse(partialMarkdown);
        setContent(html);
      } catch (e) {
        console.error("Error loading README:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [repoUrl]);

  if (loading || error || !content) return null; 

  return (
    <div
      className="prose mx-auto p-4 bg-white rounded shadow max-w-2xl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
