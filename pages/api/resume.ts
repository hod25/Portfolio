import type { NextApiRequest, NextApiResponse } from "next";

const DOC_ID = "1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW";
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=pdf`;
const FILE_NAME = "Hod_Mitrany_Resume.pdf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const upstream = await fetch(EXPORT_URL, { cache: "no-store" });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: "Failed to fetch resume PDF" });
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const forceDownload = req.query.download === "1";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader(
      "Content-Disposition",
      `${forceDownload ? "attachment" : "inline"}; filename="${FILE_NAME}"`
    );

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Failed to stream resume PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}