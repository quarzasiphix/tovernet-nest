#!/usr/bin/env node
// Builds the legal document registry from content/legal/:
//   - public/legal/<key>-<version>.pdf for each Markdown document (Chromium via Playwright),
//   - lib/legal/registry.json with the SHA-256 of each source file and PDF,
//   - with --sql, the INSERT for tovernet.legal_documents (KsięgaI migration).
// A published version is immutable: if the source changed but the version did not, the
// build stops and asks for a new version. Usage: node scripts/legal-build.mjs [--sql] [--check]

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLegal, toHtml } from '../lib/legal/markdown.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'content/legal');
const OUT = join(ROOT, 'public/legal');
const REGISTRY = join(ROOT, 'lib/legal/registry.json');
const args = new Set(process.argv.slice(2));
const sha = (buf) => createHash('sha256').update(buf).digest('hex');

const previous = existsSync(REGISTRY) ? JSON.parse(readFileSync(REGISTRY, 'utf8')) : [];
const known = new Map(previous.map((d) => [`${d.key}@${d.version}`, d]));

function loadPlaywright() {
  for (const base of [ROOT, '/p/ksiegai/']) {
    try { return createRequire(join(base, 'package.json'))('playwright'); } catch { /* next */ }
    const pnpm = join(base, 'node_modules/.pnpm');
    if (!existsSync(pnpm)) continue;
    const dir = readdirSync(pnpm).find((d) => /^playwright@/.test(d));
    if (dir) return createRequire(join(pnpm, dir, 'node_modules/playwright/package.json'))('playwright');
  }
  throw new Error('playwright not found (install it or keep /p/ksiegai installed)');
}

// The Playwright package found may expect another browser build than the one installed;
// use the newest installed headless shell when the expected one is missing.
function installedChromium() {
  if (process.env.LEGAL_CHROMIUM) return process.env.LEGAL_CHROMIUM;
  const cache = join(process.env.HOME ?? '', '.cache/ms-playwright');
  if (!existsSync(cache)) return undefined;
  const dir = readdirSync(cache).filter((d) => /^chromium_headless_shell-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))[0];
  const bin = dir && [join(cache, dir, 'chrome-headless-shell-linux64/chrome-headless-shell'), join(cache, dir, 'chrome-linux/headless_shell')].find(existsSync);
  return bin || undefined;
}

const css = `
  @page { size: A4; margin: 18mm 16mm 20mm; }
  body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 9.5pt; line-height: 1.45; color: #111; }
  h1 { font-size: 16pt; margin: 0 0 4pt; } h2 { font-size: 11pt; margin: 14pt 0 4pt; break-after: avoid; }
  h3 { font-size: 10pt; margin: 10pt 0 3pt; } p { margin: 0 0 5pt; } ol, ul { margin: 0 0 6pt; padding-left: 16pt; }
  li { margin: 0 0 3pt; } table { border-collapse: collapse; width: 100%; margin: 4pt 0 8pt; break-inside: avoid; }
  th, td { border: 0.5pt solid #999; padding: 3pt 4pt; text-align: left; vertical-align: top; font-size: 8.5pt; }
  th { background: #eee; } .meta { color: #555; font-size: 8pt; margin-bottom: 10pt; }`;

const footer = (meta, hash) => `<div style="font-size:7pt;color:#666;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:Arial">
  <span>Tovernet Sp. z o.o. · KRS 0001211630 · ${meta.title}, wersja ${meta.version} z ${meta.effective} · SHA-256 ${hash.slice(0, 16)}…</span>
  <span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`;

const entries = [];
let browser = null;
const failures = [];

for (const file of readdirSync(SRC).sort()) {
  const source = readFileSync(join(SRC, file));
  const hash = sha(source);
  if (file.endsWith('.json')) {
    const j = JSON.parse(source.toString('utf8'));
    entries.push({ key: j.key, version: j.version, title: j.title, effective: j.effective, sha256: hash, source: `content/legal/${file}`, pdf: null, pdf_sha256: null });
    continue;
  }
  if (!file.endsWith('.md')) continue;
  const { meta, blocks } = parseLegal(source.toString('utf8'));
  const old = known.get(`${meta.key}@${meta.version}`);
  if (old && old.sha256 !== hash) {
    failures.push(`${file}: source changed but version ${meta.version} is already in the registry. Bump the version.`);
    continue;
  }
  const pdfName = `${meta.key}-${meta.version}.pdf`;
  const pdfPath = join(OUT, pdfName);
  if (!args.has('--check') && !(old && existsSync(pdfPath))) {
    browser ??= await loadPlaywright().chromium.launch({ executablePath: installedChromium() });
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>${css}</style></head><body>${toHtml(blocks)}</body></html>`);
    mkdirSync(OUT, { recursive: true });
    await page.pdf({ path: pdfPath, format: 'A4', displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer(meta, hash), margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' } });
    await page.close();
  }
  if (!existsSync(pdfPath)) { failures.push(`${pdfName} missing; run without --check`); continue; }
  entries.push({ ...meta, sha256: hash, source: `content/legal/${file}`, pdf: `/legal/${pdfName}`, pdf_sha256: sha(readFileSync(pdfPath)) });
}
await browser?.close();

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }

// Keep retired versions: the registry is append-only.
const current = new Set(entries.map((e) => `${e.key}@${e.version}`));
const registry = [...previous.filter((d) => !current.has(`${d.key}@${d.version}`)), ...entries]
  .sort((a, b) => a.key.localeCompare(b.key) || a.version.localeCompare(b.version, undefined, { numeric: true }));

if (args.has('--check')) {
  const same = JSON.stringify(registry) === JSON.stringify(previous);
  console.log(same ? 'legal registry up to date' : 'legal registry out of date: run node scripts/legal-build.mjs');
  process.exit(same ? 0 : 1);
}
writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
console.log(`legal registry: ${registry.length} documents`);
for (const e of registry) console.log(`  ${e.key}@${e.version} ${e.sha256.slice(0, 12)} ${e.pdf ?? '(no pdf)'}`);

if (args.has('--sql')) {
  const q = (v) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
  console.log('\nINSERT INTO tovernet.legal_documents (doc_key, version, title, effective_from, sha256, pdf_path, pdf_sha256, body) VALUES');
  console.log(registry.map((e) => {
    const body = readFileSync(join(ROOT, e.source), 'utf8');
    return `  (${q(e.key)}, ${q(e.version)}, ${q(e.title)}, ${q(e.effective)}, ${q(e.sha256)}, ${q(e.pdf)}, ${q(e.pdf_sha256)}, ${q(body)})`;
  }).join(',\n') + '\nON CONFLICT (doc_key, version) DO NOTHING;');
}
