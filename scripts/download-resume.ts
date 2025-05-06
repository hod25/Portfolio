// scripts/download-resume.ts
import fs from "fs";
import https from "https";
import path from "path";

const fileUrl = "https://docs.google.com/document/d/1oCLnmsEQrpIXQk7-LObgFLzX1nPyVlUW/export?format=pdf";
const outputPath = path.resolve("public", "Hod_Mitrany_Resume.pdf");

// Ensure the output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 307) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          console.log(`Redirecting to: ${redirectUrl}`);
          resolve(downloadFile(redirectUrl)); // Follow redirect
        } else {
          reject(new Error("Redirect location not provided."));
        }
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download file. Status code: ${res.statusCode}`));
        res.resume();
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        console.log("✅ Resume PDF downloaded successfully.");
        resolve();
      });

      fileStream.on("error", (err) => {
        reject(err);
      });
    }).on("error", reject);
  });
}

downloadFile(fileUrl)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to download resume:", err.message);
    process.exit(1);
  });
