// Registry rules for the credibility drawer and the future public portfolio page.
// Run: npm test (node --test, Node 22.18+ strips the types; no build step).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PROJECTS, UNLISTED_SLUGS, VERIFIED_ON, evidenceHref, hostOf, isPublishable, localize, offerGroups, offerProjects, projectsLabel, siteProjects, type PortfolioProject,
} from './portfolio.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Width and height from a WebP header (VP8, VP8L or VP8X). */
function webpSize(file: string): { width: number; height: number } {
  const b = readFileSync(file);
  assert.equal(b.toString('ascii', 0, 4), 'RIFF', `${file}: not RIFF`);
  assert.equal(b.toString('ascii', 8, 12), 'WEBP', `${file}: not WebP`);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`${file}: unknown WebP chunk ${chunk}`);
}

test('slugs are unique and URL-safe', () => {
  const slugs = PROJECTS.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('every screenshot exists, is small WebP, and its declared size matches the file', () => {
  for (const p of PROJECTS) {
    for (const shot of p.shots) {
      const file = join(root, 'public', shot.src);
      assert.ok(existsSync(file), `${p.slug}: missing ${shot.src}`);
      assert.ok(shot.src.startsWith('/portfolio/') && shot.src.endsWith('.webp'), `${p.slug}: ${shot.src} must be /portfolio/*.webp`);
      assert.ok(readFileSync(file).length < 150_000, `${p.slug}: ${shot.src} over 150 kB`);
      assert.deepEqual(webpSize(file), { width: shot.width, height: shot.height }, `${p.slug}: ${shot.src} size`);
      assert.ok(shot.alt.trim().length >= 10, `${p.slug}: ${shot.src} needs a descriptive alt`);
    }
  }
});

test('clearance follows the kind: client work is never "own", own products always are', () => {
  for (const p of PROJECTS) {
    if (p.kind === 'own_product') assert.equal(p.clearance, 'own', p.slug);
    if (p.kind === 'client_site' || p.kind === 'client_system') assert.notEqual(p.clearance, 'own', p.slug);
  }
});

test('the offer shows 3-6 live, cleared projects with a screenshot and evidence, in rank order', () => {
  const shown = offerProjects();
  assert.ok(shown.length >= 3 && shown.length <= 6, `offer shows ${shown.length}`);
  const ranks = shown.map((p) => p.offerRank);
  assert.deepEqual(ranks, [...ranks].sort((a, b) => (a ?? 0) - (b ?? 0)));
  assert.equal(new Set(ranks).size, ranks.length, 'duplicate offerRank');
  for (const p of shown) {
    assert.equal(p.status, 'live', p.slug);
    assert.ok(isPublishable(p), p.slug);
    if (p.access === 'private') assert.equal(p.url, undefined, `${p.slug}: a private system is never linked`);
    else assert.ok(p.url?.startsWith('https://'), `${p.slug}: live project needs an https URL`);
  }
});

test('unapproved client material and concepts never reach the offer', () => {
  const base = PROJECTS.find((p) => p.slug === 'nekrolog-lodz') as PortfolioProject;
  const pending: PortfolioProject = { ...base, slug: 'pending-client', clearance: 'needs_approval', offerRank: 0 };
  const concept: PortfolioProject = { ...base, slug: 'concept', kind: 'concept', status: 'concept', offerRank: 0 };
  const shown = offerProjects([pending, concept, ...PROJECTS]).map((p) => p.slug);
  assert.ok(!shown.includes('pending-client'));
  assert.ok(!shown.includes('concept'));
});

test('a site credit points at the project\'s own domain', () => {
  for (const p of PROJECTS) {
    for (const e of p.evidence) {
      if (e.kind !== 'site_credit' && e.kind !== 'operator') continue;
      assert.ok(e.url && p.url, `${p.slug}: credit needs both URLs`);
      assert.equal(hostOf(e.url), hostOf(p.url), `${p.slug}: credit on another domain`);
    }
  }
});

test('case studies point at existing pages', () => {
  for (const p of PROJECTS) {
    for (const path of [p.caseStudy, ...p.evidence.filter((e) => e.kind === 'case_study').map((e) => e.url)]) {
      if (!path) continue;
      assert.match(path, /^\/projekty\/[a-z0-9-]+$/, `${p.slug}: ${path}`);
      assert.ok(existsSync(join(root, 'app', '[locale]', `${path}`, 'page.tsx')), `${p.slug}: no page for ${path}`);
    }
  }
});

test('copy describes what was built, never results, metrics or testimonials (PL and EN)', () => {
  const claim = /%|\d+\s*(x|razy|times)\b|wzrost|więcej (zapytań|klientów|zamówień)|zadowolon|poleca|opini[aei] klient|increase|more (leads|customers|orders)|satisfied|recommend|testimonial/i;
  for (const p of PROJECTS) {
    const en = p.en;
    for (const text of [p.summary, p.role, p.headline ?? '', ...p.built, ...(en ? [en.summary, en.role, en.headline, ...en.built] : [])]) {
      assert.doesNotMatch(text, claim, `${p.slug}: "${text}"`);
    }
  }
});

test('prepared projects (Anemalo, GlobalPet) are unlisted and never shown', () => {
  assert.deepEqual([...UNLISTED_SLUGS].sort(), ['anemalo', 'globalpet']);
  const shown = [...siteProjects(), ...offerProjects()].map((p) => p.slug);
  for (const slug of UNLISTED_SLUGS) assert.ok(!shown.includes(slug), `${slug} is shown`);
  for (const p of PROJECTS.filter((x) => x.unlisted)) assert.equal(isPublishable(p), false, p.slug);
});

test('every project on the public site has a case study, a palette, preview assets and English copy', () => {
  const site = siteProjects();
  assert.ok(site.length >= 4, `site shows ${site.length}`);
  for (const p of site) {
    assert.ok(p.caseStudy && p.palette && p.preview?.full && p.preview?.phone, `${p.slug}: incomplete`);
    assert.ok(p.en, `${p.slug}: no English copy`);
    assert.equal(p.en!.evidence.length, p.evidence.length, `${p.slug}: English evidence labels`);
    assert.equal(p.en!.built.length, p.built.length, `${p.slug}: English built list`);
    for (const shot of [p.preview!.full!, p.preview!.phone!]) {
      const file = join(root, 'public', shot.src);
      assert.ok(existsSync(file), `${p.slug}: missing ${shot.src}`);
      assert.ok(readFileSync(file).length < 400_000, `${p.slug}: ${shot.src} over 400 kB`);
      assert.deepEqual(webpSize(file), { width: shot.width, height: shot.height }, `${p.slug}: ${shot.src} size`);
      assert.ok(shot.altEn && shot.alt, `${p.slug}: ${shot.src} alt in both languages`);
    }
    assert.equal(localize(p, 'en').summary, p.en!.summary);
    assert.equal(localize(p, 'pl').summary, p.summary);
  }
  const ranks = site.map((p) => p.siteRank);
  assert.equal(new Set(ranks).size, ranks.length, 'duplicate siteRank');
});

test('groups put client websites first and drop empty groups', () => {
  const groups = offerGroups();
  assert.equal(groups[0].key, 'sites');
  for (const g of groups) assert.ok(g.projects.length > 0);
});

test('VERIFIED_ON is an ISO date', () => {
  assert.match(VERIFIED_ON, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(Date.parse(VERIFIED_ON)));
});

test('helpers', () => {
  assert.equal(evidenceHref('/projekty/pokiu'), '/pl/projekty/pokiu');
  assert.equal(evidenceHref('https://kolorowapasja.pl'), 'https://kolorowapasja.pl');
  assert.equal(hostOf('https://www.ksiegai.pl/x/y'), 'ksiegai.pl');
  assert.equal(projectsLabel(1), '1 działający projekt');
  assert.equal(projectsLabel(3), '3 działające projekty');
  assert.equal(projectsLabel(6), '6 działających projektów');
  assert.equal(projectsLabel(12), '12 działających projektów');
  assert.equal(projectsLabel(22), '22 działające projekty');
});

test('POKIU: only the office software is ours, never linked, no pokiu.pl anywhere', () => {
  const p = PROJECTS.find((x) => x.slug === 'pokiu') as PortfolioProject;
  assert.equal(p.access, 'private');
  assert.equal(p.url, undefined);
  assert.doesNotMatch(JSON.stringify(p), /pokiu\.pl/);
});
