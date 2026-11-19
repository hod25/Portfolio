import type { NextApiRequest, NextApiResponse } from "next";
import { fetchPortfolioData, isValidGitHubUsername } from "../../lib/github";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawUsername = req.query.username;
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  if (!username || !isValidGitHubUsername(username)) {
    res.status(400).json({ error: "Invalid GitHub username." });
    return;
  }

  const data = await fetchPortfolioData(username);

  if (data.error && !data.user) {
    const status = data.error.includes("not found")
      ? 404
      : data.error.includes("rate limit")
        ? 429
        : 502;
    res.status(status).json(data);
    return;
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  res.status(200).json(data);
}
