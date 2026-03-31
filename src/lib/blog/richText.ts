export type CalloutVariant = "note" | "warning" | "insight" | "takeaway" | "faq";

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "callout"; variant: CalloutVariant; text: string }
  | { type: "pull-quote"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "image"; src: string; alt: string; title?: string }
  | {
      type: "video";
      kind: "embed" | "file";
      src: string;
      sourceUrl: string;
      title?: string;
      provider?: string;
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code-block"; language: string; code: string }
  | {
      type: "footnote-list";
      items: Array<{ id: string; index: number; text: string }>;
    }
  | { type: "divider" };

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ParsedArticle {
  blocks: ArticleBlock[];
  headings: Array<{ id: string; text: string; level: 2 | 3 }>;
  footnotes: Array<{ id: string; index: number; text: string }>;
  faqs: FaqEntry[];
  takeaway: string | null;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

function isVideoFileUrl(value: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(value);
}

function resolveVideoSource(value: string) {
  const safe = sanitizeUrl(value);
  if (!safe) return null;

  if (isVideoFileUrl(safe)) {
    return { kind: "file" as const, src: safe, provider: "file" };
  }

  const youtubeMatch =
    safe.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i) ||
    safe.match(/^https?:\/\/youtu\.be\/([^?&/]+)/i) ||
    safe.match(/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([^?&/]+)/i);
  if (youtubeMatch) {
    return {
      kind: "embed" as const,
      src: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      provider: "youtube",
    };
  }

  const vimeoMatch =
    safe.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i) ||
    safe.match(/^https?:\/\/player\.vimeo\.com\/video\/(\d+)/i);
  if (vimeoMatch) {
    return {
      kind: "embed" as const,
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      provider: "vimeo",
    };
  }

  const loomMatch =
    safe.match(/^https?:\/\/(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/i) ||
    safe.match(/^https?:\/\/(?:www\.)?loom\.com\/embed\/([a-zA-Z0-9]+)/i);
  if (loomMatch) {
    return {
      kind: "embed" as const,
      src: `https://www.loom.com/embed/${loomMatch[1]}`,
      provider: "loom",
    };
  }

  const wistiaMatch =
    safe.match(
      /^https?:\/\/(?:www\.)?fast\.wistia\.(?:net|com)\/embed\/iframe\/([a-zA-Z0-9]+)/i,
    ) ||
    safe.match(
      /^https?:\/\/(?:www\.)?wistia\.com\/medias\/([a-zA-Z0-9]+)/i,
    );
  if (wistiaMatch) {
    return {
      kind: "embed" as const,
      src: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}`,
      provider: "wistia",
    };
  }

  return null;
}

export function renderInlineMarkup(value: string): string {
  const pattern =
    /(\[\^(\d+)\]|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;

  let result = "";
  let lastIndex = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    result += escapeHtml(value.slice(lastIndex, index));

    const [
      ,
      full,
      footnoteIndex,
      linkLabel,
      linkHref,
      strongText,
      codeText,
      emText,
    ] = match;

    if (footnoteIndex) {
      result += `<sup><a id="fnref-${escapeHtml(footnoteIndex)}" href="#fn-${escapeHtml(footnoteIndex)}" role="doc-noteref">${escapeHtml(footnoteIndex)}</a></sup>`;
    } else if (linkLabel && linkHref) {
      const safeHref = sanitizeUrl(linkHref);
      result += safeHref
        ? `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabel)}</a>`
        : escapeHtml(full);
    } else if (strongText) {
      result += `<strong>${escapeHtml(strongText)}</strong>`;
    } else if (codeText) {
      result += `<code>${escapeHtml(codeText)}</code>`;
    } else if (emText) {
      result += `<em>${escapeHtml(emText)}</em>`;
    } else {
      result += escapeHtml(full);
    }

    lastIndex = index + full.length;
  }

  result += escapeHtml(value.slice(lastIndex));
  return result;
}

function collectParagraph(lines: string[], startIndex: number) {
  const content: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (
      !line ||
      /^#{2,3}\s+/.test(line) ||
      /^>>\s?/.test(line) ||
      /^>\s?/.test(line) ||
      /^[-*]\s+/.test(line) ||
      /^\d+\.\s+/.test(line) ||
      /^---+$/.test(line) ||
      /^```/.test(line) ||
      /^\|.+\|$/.test(line) ||
      /^\[\^\d+\]:/.test(line) ||
      /^!\[.*\]\(\S+/.test(line) ||
      /^!video\[.*\]\(\S+/.test(line)
    ) {
      break;
    }

    content.push(line);
    index += 1;
  }

  return {
    text: content.join(" "),
    nextIndex: index,
  };
}

const CALLOUT_VARIANTS = new Set<string>([
  "note",
  "warning",
  "insight",
  "takeaway",
  "faq",
]);

export function parseArticle(body: string): ParsedArticle {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ArticleBlock[] = [];
  const headings: ParsedArticle["headings"] = [];
  const footnotes: ParsedArticle["footnotes"] = [];
  const usedHeadingIds = new Set<string>();
  let takeaway: string | null = null;
  const faqs: FaqEntry[] = [];

  let index = 0;
  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    // --- Code block (fenced) ---
    const codeOpenMatch = line.match(/^```(\w*)$/);
    if (codeOpenMatch) {
      const language = codeOpenMatch[1] || "";
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code-block", language, code: codeLines.join("\n") });
      continue;
    }

    // --- Heading ---
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 2 | 3;
      const text = headingMatch[2].trim();
      let id = slugify(text);
      let suffix = 2;

      while (!id || usedHeadingIds.has(id)) {
        id = `${slugify(text) || "section"}-${suffix++}`;
      }

      usedHeadingIds.add(id);
      const heading = { type: "heading" as const, level, text, id };
      blocks.push(heading);
      headings.push({ id, text, level });
      index += 1;
      continue;
    }

    // --- Image ---
    const imageMatch = line.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.*)")?\)$/);
    if (imageMatch) {
      const src = sanitizeUrl(imageMatch[2]);
      if (src) {
        blocks.push({
          type: "image",
          src,
          alt: imageMatch[1] || "",
          ...(imageMatch[3] ? { title: imageMatch[3] } : {}),
        });
      }
      index += 1;
      continue;
    }

    // --- Video ---
    const videoMatch = line.match(/^!video\[(.*?)\]\((\S+?)\)$/i);
    if (videoMatch) {
      const sourceUrl = sanitizeUrl(videoMatch[2]);
      const resolved = sourceUrl ? resolveVideoSource(sourceUrl) : null;
      if (sourceUrl && resolved) {
        blocks.push({
          type: "video",
          kind: resolved.kind,
          src: resolved.src,
          sourceUrl,
          ...(videoMatch[1] ? { title: videoMatch[1] } : {}),
          ...(resolved.provider ? { provider: resolved.provider } : {}),
        });
      }
      index += 1;
      continue;
    }

    // --- Divider ---
    if (/^---+$/.test(line)) {
      blocks.push({ type: "divider" });
      index += 1;
      continue;
    }

    // --- Table ---
    if (
      /^\|.+\|$/.test(line) &&
      index + 1 < lines.length &&
      /^\|[\s:|-]+\|$/.test(lines[index + 1].trim())
    ) {
      const headerCells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      index += 2;
      const rows: string[][] = [];
      while (
        index < lines.length &&
        /^\|.+\|$/.test(lines[index].trim())
      ) {
        rows.push(
          lines[index]
            .trim()
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim()),
        );
        index += 1;
      }
      blocks.push({ type: "table", headers: headerCells, rows });
      continue;
    }

    // --- Footnote definition ---
    const footnoteDefMatch = line.match(/^\[\^(\d+)\]:\s+(.+)$/);
    if (footnoteDefMatch) {
      footnotes.push({
        id: `fn-${footnoteDefMatch[1]}`,
        index: parseInt(footnoteDefMatch[1]),
        text: footnoteDefMatch[2],
      });
      index += 1;
      continue;
    }

    // --- Pull-quote (>>) ---
    if (/^>>\s?/.test(line)) {
      const pullLines: string[] = [];
      while (index < lines.length && /^>>\s?/.test(lines[index].trim())) {
        pullLines.push(lines[index].trim().replace(/^>>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "pull-quote", text: pullLines.join(" ") });
      continue;
    }

    // --- Callout (> [!variant]) or regular blockquote ---
    if (/^>\s?/.test(line)) {
      const calloutMatch = line.match(/^>\s?\[!(\w+)\]\s?(.*)$/);
      if (calloutMatch && CALLOUT_VARIANTS.has(calloutMatch[1])) {
        const variant = calloutMatch[1] as CalloutVariant;
        const contentLines: string[] = [];
        if (calloutMatch[2]) contentLines.push(calloutMatch[2]);
        index += 1;
        while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
          contentLines.push(lines[index].trim().replace(/^>\s?/, ""));
          index += 1;
        }
        const text = contentLines.join(" ").trim();
        if (variant === "takeaway" && takeaway === null) {
          takeaway = text;
        }
        if (variant === "faq") {
          // First line (from the [!faq] directive line) is the question, rest is the answer
          const question = calloutMatch[2]?.trim() || "";
          const answer = contentLines.slice(1).join(" ").trim() || contentLines[0] || "";
          if (question) {
            faqs.push({ question, answer });
          }
        }
        blocks.push({ type: "callout", variant, text });
        continue;
      }

      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // --- Unordered list ---
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    // --- Ordered list ---
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // --- Paragraph (fallback) ---
    const paragraph = collectParagraph(lines, index);
    if (paragraph.text) {
      blocks.push({ type: "paragraph", text: paragraph.text });
    }
    index = paragraph.nextIndex;
  }

  if (footnotes.length > 0) {
    blocks.push({
      type: "footnote-list",
      items: footnotes.sort((a, b) => a.index - b.index),
    });
  }

  return { blocks, headings, footnotes, faqs, takeaway };
}
