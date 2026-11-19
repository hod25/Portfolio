import fs from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const DOC_ID = "1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW";
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=pdf`;
const FILE_NAME = "Hod_Mitrany_Resume.pdf";
const FALLBACK_PDF_PATH = path.resolve(process.cwd(), "public", FILE_NAME);

async function fetchResumeBuffer(): Promise<Buffer> {
  try {
    const upstream = await fetch(EXPORT_URL);
    if (upstream.ok) {
      return Buffer.from(await upstream.arrayBuffer());
    }
    console.warn(`Google Docs export returned ${upstream.status}, using local fallback.`);
  } catch (error) {
    console.warn("Google Docs export failed, using local fallback:", error);
  }

  return fs.readFile(FALLBACK_PDF_PATH);
}

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
    const buffer = await fetchResumeBuffer();
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
