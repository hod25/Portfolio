import { FaStar } from "react-icons/fa";
import ReadmeViewer from "./ReadmeViewer";

export interface RepoCardProps {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count?: number;
  readmeHtml: string;
}

export default function RepoCard({
  name,
  description,
  html_url,
  language,
  stargazers_count = 0,
  readmeHtml,
}: RepoCardProps) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{name}</h3>
        <div className="project-meta">
          {language && <span className="language-badge">{language}</span>}
          {stargazers_count > 0 && (
            <span className="stars-badge" aria-label={`${stargazers_count} stars`}>
              <FaStar aria-hidden="true" /> {stargazers_count}
            </span>
          )}
        </div>
      </div>

      {readmeHtml ? (
        <div className="readme-wrapper">
          <ReadmeViewer html={readmeHtml} />
        </div>
      ) : (
        description && <p className="project-description">{description}</p>
      )}

      <a
        href={html_url}
        className="view-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </article>
  );
}
