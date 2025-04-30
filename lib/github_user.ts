export const fetchRepos = async (username: string) => {
  if (!username) return { repos: [], user: null };

  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos`),
      fetch(`https://api.github.com/users/${username}`),
    ]);

    if (!reposRes.ok || !userRes.ok) throw new Error("GitHub API error");

    const repos = await reposRes.json();
    const user = await userRes.json();

    // סינון רק ריפוז עם README
    const filteredRepos = await Promise.all(
      repos.map(async (repo: any) => {
        const branches = ["main", "master"];
        for (const branch of branches) {
          const readmeUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/README.md`;
          const head = await fetch(readmeUrl, { method: "HEAD" });
          if (head.ok) return repo;
        }
        return null; // אין README
      })
    );

    return {
      repos: filteredRepos.filter(Boolean), // מסיר nullים
      user,
    };

  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return { repos: [], user: null };
  }
};
