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

        // Extract top section before "---" or fallback to 10 lines
        const lines = markdown.split('\n');
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

  if (loading) return <p className="text-gray-500 italic">Loading README...</p>;
  if (error) return <p className="text-red-500 italic">No README found for this repository.</p>;

  return (
    <div
      className="prose mx-auto p-4 bg-white rounded shadow max-w-2xl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
