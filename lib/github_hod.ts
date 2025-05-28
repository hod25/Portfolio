export async function fetchRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
  if (!res.ok) {
    throw new Error('Failed to fetch repos');
  }

  const repos = await res.json();

  const updatedRepos = await Promise.all(
    repos.map(async (repo: any) => {
      const branches = ['main', 'master'];
      let readmeContent = '';

      for (const branch of branches) {
        const readmeUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/README.md`;
        const response = await fetch(readmeUrl);

        if (response.ok) {
          const content = await response.text();
          const lines = content.split('\n').filter(line => line.trim() !== '');
          if (lines.length >= 2) {
            readmeContent = content;  // שמירה של תוכן ה-README אם יש לפחות 2 שורות
            break; // אם מצאנו README עם תוכן מתאים, יצאנו מהלולאה
          }
        }
      }

      return { 
        ...repo, 
        readme: readmeContent,  // אם אין תוכן ה-README, הוא יישאר ריק
      };
    })
  );

  // סינון הריפויים עם README טוב
  const filteredRepos = updatedRepos.filter((repo) => repo.readme && repo.readme.trim().length >= 2);

  // אם יש יותר מ-8 ריפויים טובים, החזר את ה-8 הטובים בלבד
  if (filteredRepos.length >= 8) {
    return filteredRepos.slice(0, 8);
  }

  // אם יש פחות מ-8 ריפויים טובים, הוסף ריפויים נוספים (ללא README תקין) עד למלא את ה-8
  const remainingReposNeeded = 8 - filteredRepos.length;

  // מסנן את הריפויים שה-README שלהם לא תקין
  const remainingRepos = updatedRepos
    .filter((repo) => !repo.readme || repo.readme.trim().length < 2)
    .slice(0, remainingReposNeeded);

  // מחזיר את הריפויים התקינים ואז את הריפויים הנותרים (בלי להציג את ה-README שלהם)
  return [...filteredRepos, ...remainingRepos];
}

export async function fetchUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}