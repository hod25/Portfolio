"use client";

import ReadmeViewer from "./ReadmeViewer"; // מייבאים את הקומפוננטה

type RepoCardProps = {
  name: string;
  description: string;
  html_url: string;
  language: string | null;
};

export default function RepoCard({ name, description, html_url, language }: RepoCardProps) {
  return (
    <div className="project-card">
      {/* <h3 className="text-xl font-bold mb-2">{name}</h3> */}
      {/* <p className="text-gray-600 mb-2">{description || 'No description'}</p> */}

            {/* מציג את ה-README */}
            <div className="mt-4">
        <ReadmeViewer repoUrl={html_url} />
      </div>

      {/* <p className="text-sm text-blue-500">{language}</p> */}
      <a
        href={html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        {/* {name} */}
        View on GitHub
      </a>
    </div>
  );
}
