export type LegalMeta = { key: string; version: string; title: string; effective: string };
export type LegalBlock =
  | { type: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ol' | 'ul'; items: string[]; start?: number }
  | { type: 'table'; head: string[]; rows: string[][] };
export function parseLegal(source: string): { meta: LegalMeta; blocks: LegalBlock[] };
export function inline(text: string): { bold: boolean; text: string }[];
export function toHtml(blocks: LegalBlock[]): string;
