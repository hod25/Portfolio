import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "strong", "em", "b", "i", "del", "s",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

function resolveRelativeUrl(
  src: string,
  owner: string,
  repo: string,
  branch: string
): string {
  const trimmed = src.trim();
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\.?\//, "");
  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${cleanPath}`;
}

export function extractReadmeSnippet(markdown: string): string {
  const lines = markdown
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length <= 1) {
    return "";
  }

  const separatorIndex = lines.findIndex((line) => line.trim() === "---");
  const relevantLines =
    separatorIndex !== -1 ? lines.slice(0, separatorIndex) : lines.slice(0, 7);

  return relevantLines.join("\n");
}

export async function renderReadmePreview(
  markdown: string,
  owner: string,
  repo: string,
  branch: string
): Promise<string> {
  const snippet = extractReadmeSnippet(markdown);
  if (!snippet) return "";

  const markedInstance = new Marked({
    gfm: true,
    breaks: false,
  });

  const rawHtml = await markedInstance.parse(snippet);

  return sanitizeHtml(rawHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
    },
    allowedSchemes: ["http", "https"],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      img: (_tagName, attribs) => {
        const src = attribs.src
          ? resolveRelativeUrl(attribs.src, owner, repo, branch)
          : "";
        return {
          tagName: "img",
          attribs: {
            ...attribs,
            src,
            loading: "lazy",
          },
        };
      },
    },
  });
}
