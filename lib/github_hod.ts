export async function fetchRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
  if (!res.ok) {
    throw new Error('Failed to fetch repos');
  }

  const repos = await res.json();

  // פונקציה לבדיקה אם README מכיל תוכן משמעותי
  const hasSignificantContent = (content: string): boolean => {
    if (!content || content.trim().length === 0) return false;
    
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // בדוק שיש לפחות 3 שורות לא ריקות
    if (lines.length < 3) return false;
    
    // ספור שורות שהן לא רק כותרות (לא מתחילות ב-#)
    const nonHeaderLines = lines.filter(line => !line.startsWith('#'));
    
    // וודא שיש לפחות 2 שורות שאינן כותרות
    if (nonHeaderLines.length < 2) return false;
    
    // ספור כמה מילים יש בשורות שאינן כותרות
    const wordCount = nonHeaderLines.join(' ').split(/\s+/).filter(word => word.length > 0).length;
    
    // וודא שיש לפחות 10 מילים של תוכן אמיתי
    return wordCount >= 10;
  };

  const updatedRepos = await Promise.all(
    repos.map(async (repo: any) => {
      const branches = ['main', 'master'];
      let readmeContent = '';
      let hasGoodReadme = false;

      for (const branch of branches) {
        const readmeUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/README.md`;
        const response = await fetch(readmeUrl);

        if (response.ok) {
          const content = await response.text();
          if (hasSignificantContent(content)) {
            readmeContent = content;
            hasGoodReadme = true;
            break;
          }
        }
      }

      return { 
        ...repo, 
        readme: readmeContent,
        hasGoodReadme
      };
    })
  );

  // החזר רק ריפוזיטוריים עם README איכותי
  const filteredRepos = updatedRepos
    .filter(repo => repo.hasGoodReadme)
    .slice(0, 8); // הגבל ל-8 ריפוזיטוריים טובים

  return filteredRepos;
}

export async function fetchUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}