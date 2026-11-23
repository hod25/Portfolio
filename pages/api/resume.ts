import fs from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const FILE_NAME = "Hod_Mitrany_Resume.pdf";
// The resume is versioned with the site: replace public/Hod_Mitrany_Resume.pdf to update it.
const PDF_PATH = path.resolve(process.cwd(), "public", FILE_NAME);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const buffer = await fs.readFile(PDF_PATH);
    const forceDownload = req.query.download === "1";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.setHeader(
      "Content-Disposition",
      `${forceDownload ? "attachment" : "inline"}; filename="${FILE_NAME}"`
    );

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Failed to stream resume PDF:", error);
    res.status(500).json({ error: "Failed to load resume PDF" });
  }
}
