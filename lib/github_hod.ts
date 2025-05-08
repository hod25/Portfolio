export async function fetchRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
  if (!res.ok) {
    throw new Error('Failed to fetch repos');
  }
  
  const repos = await res.json();

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

  return filteredRepos.filter(Boolean);
}

export async function fetchUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}