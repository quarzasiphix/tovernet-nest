// Minimal Markdown for legal documents in content/legal/*.md. Shared by the site pages
// (lib/legal/documents.ts) and the PDF build (scripts/legal-build.mjs), so the page and
// the PDF render the same blocks. Supported: front matter, #/##/### headings, paragraphs,
// "1." and "-" list items, pipe tables, **bold**. Anything else is a paragraph.

/**
 * @typedef {{ key: string, version: string, title: string, effective: string }} LegalMeta
 * @typedef {{ type: 'h1'|'h2'|'h3'|'p', text: string }
 *   | { type: 'ol'|'ul', items: string[], start?: number }
 *   | { type: 'table', head: string[], rows: string[][] }} LegalBlock
 */

/** @param {string} source @returns {{ meta: LegalMeta, blocks: LegalBlock[] }} */
export function parseLegal(source) {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(source);
  if (!fm) throw new Error('legal document without front matter');
  /** @type {Record<string, string>} */
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const m = /^(\w+):\s*"?(.*?)"?\s*$/.exec(line);
    if (m) meta[m[1]] = m[2];
  }
  for (const k of ['key', 'version', 'title', 'effective']) if (!meta[k]) throw new Error(`front matter: ${k} missing`);

  /** @type {LegalBlock[]} */
  const blocks = [];
  const lines = source.slice(fm[0].length).split('\n');
  let i = 0;
  const cells = (/** @type {string} */ l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { blocks.push({ type: /** @type {'h1'|'h2'|'h3'} */ (`h${h[1].length}`), text: h[2] }); i++; continue; }
    if (line.trim().startsWith('|')) {
      const head = cells(line);
      i += 2; // header + separator
      /** @type {string[][]} */
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      blocks.push({ type: 'table', head, rows });
      continue;
    }
    const ol = /^\d+[a-z]?\.\s+/, ul = /^-\s+/;
    if (ol.test(line) || ul.test(line)) {
      const re = ol.test(line) ? ol : ul;
      const start = re === ol ? parseInt(line, 10) : undefined;
      /** @type {string[]} */
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i++].replace(re, '');
        // A table indented under an item belongs to the document flow; stop there.
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !lines[i].trim().startsWith('|')) item += ' ' + lines[i++].trim();
        items.push(item);
      }
      blocks.push(re === ol ? { type: 'ol', items, start } : { type: 'ul', items });
      continue;
    }
    let text = line;
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|\||-\s|\d+\.\s)/.test(lines[i])) text += ' ' + lines[i++];
    blocks.push({ type: 'p', text });
  }
  return { meta: /** @type {LegalMeta} */ (/** @type {unknown} */ (meta)), blocks };
}

/** Splits **bold** runs. @param {string} text @returns {{ bold: boolean, text: string }[]} */
export function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((t) =>
    t.startsWith('**') && t.endsWith('**') ? { bold: true, text: t.slice(2, -2) } : { bold: false, text: t });
}

const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = (/** @type {string} */ t) => inline(t).map((r) => (r.bold ? `<strong>${esc(r.text)}</strong>` : esc(r.text))).join('');

/** HTML for the PDF. @param {LegalBlock[]} blocks */
export function toHtml(blocks) {
  return blocks.map((b) => {
    if (b.type === 'ol' || b.type === 'ul') {
      const tag = b.type;
      const start = b.type === 'ol' && b.start && b.start > 1 ? ` start="${b.start}"` : '';
      return `<${tag}${start}>${b.items.map((x) => `<li>${html(x)}</li>`).join('')}</${tag}>`;
    }
    if (b.type === 'table') {
      return `<table><thead><tr>${b.head.map((c) => `<th>${html(c)}</th>`).join('')}</tr></thead><tbody>${
        b.rows.map((r) => `<tr>${r.map((c) => `<td>${html(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    return `<${b.type}>${html(b.text)}</${b.type}>`;
  }).join('\n');
}
