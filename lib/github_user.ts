export const fetchRepos = async (username: string) => {
  if (!username) return { repos: [], user: null };

  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`),
      fetch(`https://api.github.com/users/${username}`),
    ]);

    if (!reposRes.ok || !userRes.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await reposRes.json();
    const user = await userRes.json();

    const filteredRepos = await Promise.all(
      repos.map(async (repo: any) => {
        const branches = ['main', 'master'];
        for (const branch of branches) {
          const readmeUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/README.md`;
          const response = await fetch(readmeUrl);
          if (response.ok) {
            const content = await response.text();
            const lines = content.split('\n').filter(line => line.trim() !== '');
            if (lines.length >= 2) {
              return repo;
            }
          }
        }
        return null;
      })
    );

    return {
      repos: filteredRepos.filter(Boolean),
      user,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return { repos: [], user: null };
  }
};
