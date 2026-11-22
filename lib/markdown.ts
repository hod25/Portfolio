import { Marked } from "marked";
import { filterXSS, escapeAttrValue, IWhiteList } from "xss";

const ALLOWED_TAGS: IWhiteList = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  p: [],
  br: [],
  hr: [],
  ul: [],
  ol: [],
  li: [],
  blockquote: [],
  pre: [],
  code: ["class"],
  strong: [],
  em: [],
  b: [],
  i: [],
  del: [],
  s: [],
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  table: [],
  thead: [],
  tbody: [],
  tr: [],
  th: [],
  td: [],
  span: [],
  div: [],
};

function resolveRelativeUrl(
  src: string,
  owner: string,
  repo: string,
  branch: string
): string {
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith("//")) {
    return "";
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

  return filterXSS(rawHtml, {
    whiteList: ALLOWED_TAGS,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
    onTagAttr(tag, name, value) {
      if (tag === "a" && name === "href") {
        const trimmed = value.trim();
        if (!/^https?:\/\//i.test(trimmed)) {
          return "";
        }
        return `href="${escapeAttrValue(trimmed)}" target="_blank" rel="noopener noreferrer"`;
      }
      if (tag === "img" && name === "src") {
        const resolved = resolveRelativeUrl(value, owner, repo, branch);
        if (!resolved) {
          return "";
        }
        return `src="${escapeAttrValue(resolved)}" loading="lazy"`;
      }
      return undefined;
    },
  });
}
