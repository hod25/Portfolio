export async function fetchRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=33`);
  if (!res.ok) {
    throw new Error('Failed to fetch repos');
  }
  const data = await res.json();
  return data;
}
