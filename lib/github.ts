import { renderReadmePreview } from "./markdown";

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  default_branch: string;
  updated_at: string;
  readmeHtml: string;
}

export interface PortfolioData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  error?: string;
}

interface RawGitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  default_branch?: string;
  updated_at: string;
  owner?: {
    login: string;
  };
}

const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export function isValidGitHubUsername(username: string): boolean {
  return GITHUB_USERNAME_REGEX.test(username.trim());
}

function getGitHubHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "hod-mitrany-portfolio",
  };

  if (includeAuth && process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchGitHubApi(url: string): Promise<Response> {
  const res = await fetch(url, { headers: getGitHubHeaders(true) });
  if (res.status === 401 && process.env.GITHUB_TOKEN) {
    console.warn("GITHUB_TOKEN was rejected (401); retrying without authentication.");
    return fetch(url, { headers: getGitHubHeaders(false) });
  }
  return res;
}

export function hasSignificantContent(content: string): boolean {
  if (!content || content.trim().length === 0) return false;

  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 3) return false;

  const nonHeaderLines = lines.filter((line) => !line.startsWith("#"));
  if (nonHeaderLines.length < 2) return false;

  const wordCount = nonHeaderLines
    .join(" ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return wordCount >= 10;
}

// READMEs saved by some Windows editors are UTF-16 with a BOM; response.text()
// would assume UTF-8 and produce garbage, so honour the BOM explicitly.
export function decodeReadme(bytes: Uint8Array): string {
  let encoding = "utf-8";
  if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = "utf-16le";
  else if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = "utf-16be";
  return new TextDecoder(encoding).decode(bytes).replace(/\r\n?/g, "\n");
}

async function fetchRepoReadme(
  owner: string,
  repoName: string,
  defaultBranch?: string
): Promise<{ content: string; branch: string } | null> {
  const branches = Array.from(
    new Set([defaultBranch, "main", "master"].filter((b): b is string => Boolean(b)))
  );

  for (const branch of branches) {
    const readmeUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/${encodeURIComponent(branch)}/README.md`;
    try {
      const response = await fetch(readmeUrl);
      if (response.ok) {
        const content = decodeReadme(new Uint8Array(await response.arrayBuffer()));
        if (hasSignificantContent(content)) {
          return { content, branch };
        }
        return null;
      }
    } catch {
      // Try next branch on transient fetch failure
    }
  }

  return null;
}

export async function fetchPortfolioData(username: string): Promise<PortfolioData> {
  const cleanUsername = username.trim();
  if (!isValidGitHubUsername(cleanUsername)) {
    return { user: null, repos: [], error: "Invalid GitHub username." };
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetchGitHubApi(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`),
      fetchGitHubApi(
        `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=12`
      ),
    ]);

    if (userRes.status === 404) {
      return { user: null, repos: [], error: "User not found on GitHub." };
    }

    if (userRes.status === 403 || reposRes.status === 403) {
      return {
        user: null,
        repos: [],
        error: "GitHub API rate limit exceeded. Please try again later.",
      };
    }

    if (!userRes.ok || !reposRes.ok) {
      return {
        user: null,
        repos: [],
        error: "Failed to load data from GitHub.",
      };
    }

    const user: GitHubUser = await userRes.json();
    const rawRepos: RawGitHubRepo[] = await reposRes.json();

    const reposWithReadme = await Promise.all(
      rawRepos.map(async (repo): Promise<GitHubRepo | null> => {
        const owner = repo.owner?.login || cleanUsername;
        const readme = await fetchRepoReadme(owner, repo.name, repo.default_branch);
        if (!readme) return null;

        const readmeHtml = await renderReadmePreview(
          readme.content,
          owner,
          repo.name,
          readme.branch
        );
        if (!readmeHtml) return null;

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          default_branch: readme.branch,
          updated_at: repo.updated_at,
          readmeHtml,
        };
      })
    );

    const filteredRepos = reposWithReadme
      .filter((repo): repo is GitHubRepo => repo !== null)
      .slice(0, 8);

    return {
      user,
      repos: filteredRepos,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub portfolio data:", error);
    return {
      user: null,
      repos: [],
      error: "Network error while contacting GitHub.",
    };
  }
}
