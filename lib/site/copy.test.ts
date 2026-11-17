// The two languages must say the same things: same keys, same list lengths, same project links.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COPY, PRICES, localPath, price } from './copy.ts';
import { siteProjects } from '../tovernet/portfolio.ts';

function shape(v: unknown, path: string, out: string[]) {
  if (Array.isArray(v)) { out.push(`${path}[${v.length}]`); v.forEach((x, i) => shape(x, `${path}[${i}]`, out)); }
  else if (v && typeof v === 'object') for (const k of Object.keys(v).sort()) shape((v as Record<string, unknown>)[k], `${path}.${k}`, out);
  else out.push(`${path}:${typeof v}`);
}

test('Polish and English copy have the same shape', () => {
  const a: string[] = []; const b: string[] = [];
  shape(COPY.pl, '', a); shape(COPY.en, '', b);
  assert.deepEqual(b, a);
});

test('projects named in the copy are on the public site', () => {
  const listed = new Set(siteProjects().map((p) => p.slug));
  for (const lang of ['pl', 'en'] as const) {
    for (const it of COPY[lang].services.items) for (const slug of it.projects) assert.ok(listed.has(slug), `${lang} services: ${slug}`);
    for (const r of COPY[lang].engineering.rows) if (r.project) assert.ok(listed.has(r.project), `${lang} engineering: ${r.project}`);
  }
});

test('no copy mentions unpublished ventures', () => {
  assert.doesNotMatch(JSON.stringify(COPY), /anemalo|globalpet|global pet|licencjonowan|licensed (animal|pet|transport)/i);
});

test('prices and paths', () => {
  assert.ok(PRICES.start < PRICES.firma && PRICES.firma < PRICES.pro);
  assert.equal(price(PRICES.start, 'pl').replace(/\s/g, ' '), '1 490 zł');
  assert.equal(price(PRICES.start, 'en'), 'PLN 1,490');
  assert.equal(localPath('en', '/audyt-dostawcy-uslug-cyfrowych'), '/en/digital-provider-audit/');
  assert.equal(localPath('pl', '/projekty'), '/pl/projekty/');
});
