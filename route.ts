// File: /app/api/pinned-repos/route.ts (Next.js 13+ API route with app dir)

import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com/graphql';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('user');
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    return NextResponse.json({ error: 'Missing user or token' }, { status: 400 });
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              primaryLanguage {
                name
              }
              owner {
                login
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    const json = await res.json();

    if (!json.data || !json.data.user) {
      return NextResponse.json({ error: 'User not found or no pinned repos' }, { status: 404 });
    }

    const repos = json.data.user.pinnedItems.nodes;

    // Fetch top of README for each repo
    const readmes = await Promise.all(
      repos.map(async (repo: any) => {
        const branches = ['main', 'master'];
        for (const branch of branches) {
          const readmeUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${branch}/README.md`;
          const res = await fetch(readmeUrl);
          if (res.ok) {
            const content = await res.text();
            const lines = content.split('\n').filter(l => l.trim() !== '');
            if (lines.length >= 2) {
              return {
                ...repo,
                readmePreview: lines.slice(0, 7).join('\n'),
              };
            }
          }
        }
        return null;
      })
    );

    return NextResponse.json(readmes.filter(Boolean));
  } catch (e) {
    console.error('Failed to fetch pinned repos:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
