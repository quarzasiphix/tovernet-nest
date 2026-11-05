// Legal documents on the site: read at build time from content/legal/*.md, rendered by
// LegalDocumentView. Versions and hashes come from lib/legal/registry.json, which
// scripts/legal-build.mjs writes together with the PDFs. Server-only (uses fs).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import registry from './registry.json';
import { parseLegal, type LegalBlock, type LegalMeta } from './markdown.mjs';

export type LegalDocKey = 'regulamin' | 'polityka-prywatnosci' | 'umowa-powierzenia';

export type RegistryEntry = {
  key: string;
  version: string;
  title: string;
  effective: string;
  sha256: string;
  source: string;
  pdf: string | null;
  pdf_sha256: string | null;
};

const entries = registry as RegistryEntry[];

/** Newest registered version of a document. */
export function currentEntry(key: string): RegistryEntry {
  const list = entries.filter((e) => e.key === key);
  const latest = list.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0];
  if (!latest) throw new Error(`legal document ${key} not in registry; run node scripts/legal-build.mjs`);
  return latest;
}

export function loadLegalDocument(key: LegalDocKey): { meta: LegalMeta; blocks: LegalBlock[]; entry: RegistryEntry } {
  const entry = currentEntry(key);
  const { meta, blocks } = parseLegal(readFileSync(join(process.cwd(), entry.source), 'utf8'));
  return { meta, blocks, entry };
}
