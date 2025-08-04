"use client";

import ReadmeViewer from "./ReadmeViewer"; 

type RepoCardProps = {
  name: string;
  description: string;
  html_url: string;
  language: string | null;
  viewMode?: 'grid' | 'two-per-row' | 'one-per-row';
};

export default function RepoCard({ name, description, html_url, language, viewMode = 'grid' }: RepoCardProps) {
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
        className="view-button flex items-center justify-center text-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* {name} */}
        View on GitHub
      </a>
    </div>
  );
}
