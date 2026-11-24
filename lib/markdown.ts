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

const SNIPPET_MAX_CHARS = 450;

/**
 * Take the README intro: the title plus whole paragraphs up to the first
 * `---` or second-level heading, stopping at a paragraph boundary once the
 * snippet is long enough. Never cuts a paragraph mid-sentence.
 */
export function extractReadmeSnippet(markdown: string): string {
  const blocks = markdown
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  if (blocks.length <= 1) {
    return "";
  }

  const picked: string[] = [];
  let length = 0;

  for (const [index, block] of blocks.entries()) {
    const isBreak = /^(-{3,}|\*{3,}|_{3,})$/.test(block) || /^#{2,}\s/.test(block);
    if (index > 0 && isBreak) break;
    if (picked.length > 1 && length + block.length > SNIPPET_MAX_CHARS) break;
    picked.push(block);
    length += block.length;
  }

  return picked.join("\n\n");
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
