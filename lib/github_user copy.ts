export async function fetchRepos(username: string) {
  const res = await fetch(`/api/pinned-repos?user=${username}`);
  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();

  // במידה וקיבלת הודעת שגיאה מהשרת
  if (data.error) throw new Error(data.error);

  return {
    user: data.user,
    repos: data.repos.map((repo: any) => ({
      id: `${repo.owner.login}/${repo.name}`,
      name: repo.name,
      description: repo.description,
      html_url: repo.url,
      language: repo.primaryLanguage?.name || "N/A",
      readmePreview: repo.readmePreview || null,
    })),
  };
}
