// Renders the 1200x630 link-preview card for the portfolio.
// Usage: node scripts/og-image.js   (writes public/og-image.jpg; keep the text in sync with data/profile.ts)
const sharp = require("sharp");

const chips = ["Node.js", "React", "Python", "Docker", "Proxmox", "CI/CD"];
let x = 80;
const chipSvg = chips.map((c) => {
  const w = 26 + c.length * 15.5;
  const s = `<rect x="${x}" y="418" width="${w}" height="50" rx="25" fill="#1d2b3d" stroke="#2f4a6b"/>
    <text x="${x + w / 2}" y="451" text-anchor="middle" font-size="25" fill="#cfe4ff">${c}</text>`;
  x += w + 14;
  return s;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d1117"/><stop offset="1" stop-color="#16243a"/>
    </linearGradient>
  </defs>
  <style>text{font-family:'Segoe UI',Arial,sans-serif}</style>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="630" fill="#66b2ff"/>
  <circle cx="1060" cy="120" r="260" fill="#66b2ff" opacity="0.06"/>
  <circle cx="1120" cy="560" r="180" fill="#66b2ff" opacity="0.05"/>

  <rect x="80" y="78" width="84" height="84" rx="20" fill="#66b2ff"/>
  <text x="122" y="135" text-anchor="middle" font-size="38" font-weight="700" fill="#0b0b0b">HM</text>

  <text x="80" y="275" font-size="92" font-weight="700" fill="#ffffff">Hod Mitrany</text>
  <text x="80" y="345" font-size="44" fill="#66b2ff">Junior Software Engineer · Full Stack &amp; DevOps</text>
  ${chipSvg}
  <text x="80" y="560" font-size="28" fill="#a1a1aa">portfolio.7112000.xyz</text>
  <text x="1120" y="560" text-anchor="end" font-size="28" fill="#a1a1aa">B.Sc. Computer Science · 2027</text>
</svg>`;

sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(require("path").join(__dirname, "..", "public", "og-image.jpg"))
  .then((i) => console.log(i.width, i.height, i.size));
