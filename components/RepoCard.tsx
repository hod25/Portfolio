"use client";

type RepoCardProps = {
  name: string;
  description: string;
  html_url: string;
  language: string | null;
};

export default function RepoCard({ name, description, html_url, language }: RepoCardProps) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-g ray-600 mb-2">{description || 'No description'}</p>
      <p className="text-sm text-blue-500">{language}</p>
      <a href={html_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        View Repo
      </a>
    </div>
  );
}
